import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';
import { isUUID } from 'class-validator';
import { DisappearingMessages } from '../../types/disappearing-messages';
import { RoomUser } from '../room-user/room-user.entity';
import { EVENT_TYPE } from '../../types/event-type';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RoomUser)
    private readonly roomUserRepository: Repository<RoomUser>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async createRoom(userId: string, name: string, password: string, disappearingMessages: DisappearingMessages | null) {
    this.logger.log(`Creating a new room: ${name ?? 'Unnamed Room'}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

    const admin = this.roomUserRepository.create({ user, isAdmin: true, alias: user.alias });
    await this.roomUserRepository.save(admin);

    const room = this.roomRepository.create({
      name,
      password: hashedPassword,
      users: [admin],
      disappearingMessages,
    });
    const savedRoom = await this.roomRepository.save(room);

    this.logger.log(`Room created with ID: ${savedRoom.id}`);

    const event = this.eventRepository.create({
      type: EVENT_TYPE.ROOM_CREATED,
      content: null,
      user: admin,
      room: savedRoom,
      userId: admin.user.id,
      alias: admin.alias,
    });
    await this.eventRepository.save(event);

    return savedRoom;
  }

  async getRoomDetails(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid room ID');
    }

    this.logger.log(`Fetching room details for ID: ${id}`);
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['users', 'users.user', 'events'],
      order: {
        events: {
          createdAt: 'ASC',
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const { password, events, ...rest } = room;

    return {
      ...rest,
      hasPassword: !!password,
      users: room.users.map((roomUser) => ({
        id: roomUser.id,
        isAdmin: roomUser.isAdmin,
        joinedAt: roomUser.joinedAt,
        userId: roomUser.user.id,
        alias: roomUser.alias,
      })),
    };
  }

  async getRoomEvents(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid room ID');
    }

    this.logger.log(`Fetching room events for ID: ${id}`);
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['users', 'users.user', 'events', 'events.user', 'events.user.user'],
      order: {
        events: {
          createdAt: 'ASC',
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room.events.map((event) => ({
      id: event.id,
      type: event.type,
      content: event.content,
      createdAt: event.createdAt,
      user: event.user
        ? {
            id: event.user.id,
            alias: event.user.alias,
            isAdmin: event.user.isAdmin,
            joinedAt: event.user.joinedAt,
            userId: event.userId,
          }
        : {
            id: null,
            alias: event.alias,
            isAdmin: false,
            joinedAt: null,
            userId: event.userId,
          },
    }));
  }

  async updateRoomById(id: string, data: Partial<Room>) {
    this.logger.log(`Updating room with ID: ${id}`);

    await this.roomRepository.update(id, data);
    const updatedRoom = await this.getRoomDetails(id);

    this.logger.log(`User updated with ID: ${updatedRoom.id}`);

    return updatedRoom;
  }

  async updateRoomUser(roomId: string, userId: string, data: Partial<RoomUser>) {
    this.logger.log(`Updating user with ID: ${userId} in room with ID: ${roomId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['users'] });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const roomUser = await this.roomUserRepository.findOne({
      where: { user: { id: userId }, room: { id: roomId } },
    });

    if (!roomUser) {
      throw new BadRequestException('User is not in the room');
    }

    await this.roomUserRepository.update(roomUser.id, data);
    const updatedRoomUser = await this.roomUserRepository.findOne({ where: { id: roomUser.id } });

    this.logger.log(`Updated user with id ${userId} in room with id ${roomId}`);
    return updatedRoomUser;
  }

  async joinRoom(roomId: string, userId: string, password?: string) {
    this.logger.log(`Joining room with ID: ${roomId} by user ID: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['users'] });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isUserInRoom = await this.roomUserRepository.findOne({
      where: { user, room },
    });

    if (isUserInRoom) {
      throw new BadRequestException('User is already in the room');
    }

    if (!room.password) {
      this.logger.log(`Room ${roomId} has no password, allowing access, adding user ${userId} to room.`);

      const roomUser = this.roomUserRepository.create({ user, room, isAdmin: false, alias: user.alias });
      await this.roomUserRepository.save(roomUser);

      const event = this.eventRepository.create({
        type: EVENT_TYPE.USER_JOINED,
        content: null,
        user: roomUser,
        room,
        userId: roomUser.user.id,
        alias: roomUser.alias,
      });
      await this.eventRepository.save(event);

      return { success: true };
    }

    const isMatch = await bcrypt.compare(password, room.password);

    if (!isMatch) {
      this.logger.log(`Incorrect password attempt for room ${roomId}`);
      return { success: false };
    }

    this.logger.log(`Password validated successfully for room ${roomId}, adding user ${userId} to room.`);
    const roomUser = this.roomUserRepository.create({ user, room, isAdmin: false, alias: user.alias });
    await this.roomUserRepository.save(roomUser);

    const event = this.eventRepository.create({
      type: EVENT_TYPE.USER_JOINED,
      content: null,
      user: roomUser,
      room,
      userId: roomUser.user.id,
      alias: roomUser.alias,
    });
    await this.eventRepository.save(event);

    return { success: true };
  }

  async leaveRoom(roomId: string, userId: string) {
    this.logger.log(`Leaving room with ID: ${roomId} by user ID: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['users'] });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const roomUser = await this.roomUserRepository.findOne({
      where: { room: { id: roomId }, user: { id: userId } },
      relations: ['room', 'user'],
    });

    if (!roomUser) {
      throw new NotFoundException('User is not in this room');
    }

    const event = this.eventRepository.create({
      type: EVENT_TYPE.USER_LEFT,
      content: null,
      user: roomUser,
      room,
      userId: roomUser.user.id,
      alias: roomUser.alias,
    });
    await this.eventRepository.save(event);

    await this.roomUserRepository.remove(roomUser);
    this.logger.log(`User ${userId} left room ${roomId}`);

    return room;
  }
}
