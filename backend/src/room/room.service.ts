import { Injectable, Logger } from '@nestjs/common';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async createRoom(userId: string, name?: string, password?: string) {
    this.logger.log(`Creating a new room: ${name || 'Unnamed Room'}`);

    const salt = await bcrypt.genSalt();
    const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

    const room = this.roomRepository.create({ name, password: hashedPassword, users: [userId] });
    const savedRoom = await this.roomRepository.save(room);

    this.logger.log(`Room created with ID: ${savedRoom.id}`);
    return savedRoom;
  }

  async getRoomById(id: string) {
    this.logger.log(`Fetching room by ID: ${id}`);
    return this.roomRepository.findOne({ where: { id } });
  }

  async deleteRoom(id: string) {
    this.logger.warn(`Deleting room with ID: ${id}`);
    return this.roomRepository.delete({ id });
  }

  async updateRoom(id: string, room: Partial<Room>) {
    this.logger.log(`Updating room with ID: ${id}`);
    return this.roomRepository.update({ id }, room);
  }

  async validateRoomPassword(roomId: string, userId: string, password: string) {
    this.logger.log(`Validating password for room ID: ${roomId}`);
    const room = await this.getRoomById(roomId);

    if (!room.password) {
      this.logger.log(`Room ${roomId} has no password, allowing access, adding user ${userId} to room.`);
      await this.updateRoom(roomId, { users: [...room.users, userId] });
      return true;
    }

    const isMatch = await bcrypt.compare(password, room.password);

    if (!isMatch) {
      this.logger.log(`Incorrect password attempt for room ${roomId}`);
      return false;
    }

    this.logger.log(`Password validated successfully for room ${roomId}, adding user ${userId} to room.`);
    await this.updateRoom(roomId, { users: [...room.users, userId] });
    return true;
  }
}
