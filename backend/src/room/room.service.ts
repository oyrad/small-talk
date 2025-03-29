import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRoom(userId: string, name: string, password: string, disappearingMessages: boolean) {
    this.logger.log(`Creating a new room: ${name ?? 'Unnamed Room'}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

    const room = this.roomRepository.create({
      name,
      password: hashedPassword,
      users: [user],
      creator: user,
      disappearingMessages,
    });
    const savedRoom = await this.roomRepository.save(room);

    this.logger.log(`Room created with ID: ${savedRoom.id}`);
    return savedRoom;
  }

  async getRoomById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid room ID');
    }

    this.logger.log(`Fetching room by ID: ${id}`);
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['users', 'creator', 'messages'],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    const { password, ...roomWithoutPassword } = room;

    return {
      ...roomWithoutPassword,
      hasPassword: !!password,
    };
  }

  async getRoomByIdWithPassword(id: string) {
    return await this.roomRepository.findOne({
      where: { id },
      relations: ['users', 'creator', 'messages'],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });
  }

  async updateRoomById(id: string, data: Partial<Room>) {
    this.logger.log(`Updating room with ID: ${id}`);

    await this.roomRepository.update(id, data);
    const updatedRoom = await this.getRoomById(id);

    this.logger.log(`User updated with ID: ${updatedRoom.id}`);

    return updatedRoom;
  }

  async joinRoom(roomId: string, userId: string, password?: string) {
    this.logger.log(`Joining room with ID: ${roomId} by user ID: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['users'] });

    if (!room) {
      throw new BadRequestException('Room not found');
    }

    if (!room.password) {
      this.logger.log(`Room ${roomId} has no password, allowing access, adding user ${userId} to room.`);
      room.users.push(user);
      await this.roomRepository.save(room);
      return { success: true };
    }

    const isMatch = await bcrypt.compare(password, room.password);

    if (!isMatch) {
      this.logger.log(`Incorrect password attempt for room ${roomId}`);
      return { success: false };
    }

    this.logger.log(`Password validated successfully for room ${roomId}, adding user ${userId} to room.`);
    room.users.push(user);
    await this.roomRepository.save(room);

    return { success: true };
  }

  async leaveRoom(roomId: string, userId: string) {
    this.logger.log(`Leaving room with ID: ${roomId} by user ID: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['users'] });

    if (!room) {
      throw new BadRequestException('Room not found');
    }

    room.users = room.users.filter((u) => u.id !== user.id);
    await this.roomRepository.save(room);
    this.logger.log(`User ${userId} left room ${roomId}`);

    return room;
  }
}
