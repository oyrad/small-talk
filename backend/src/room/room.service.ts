import { Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async createRoom(name?: string, password?: string) {
    const room = this.roomRepository.create({ name, password });
    return this.roomRepository.save(room);
  }

  async getRoomById(id: string) {
    return this.roomRepository.findOne({ where: { id } });
  }

  async deleteRoom(id: string) {
    return this.roomRepository.delete({ id });
  }
}
