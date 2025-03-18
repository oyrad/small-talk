import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../room/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK, {
    name: 'delete-empty-rooms',
    timeZone: 'Europe/Zagreb',
  })
  async deleteEmptyRooms() {
    this.logger.log(`Deleting empty rooms`);
    const rooms = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'users')
      .leftJoinAndSelect('room.messages', 'messages')
      .groupBy('room.id')
      .having('COUNT(users.id) = 1')
      .andHaving('COUNT(messages.id) = 0')
      .select('room.id')
      .getMany();

    if (rooms.length > 0) {
      const roomIds = rooms.map((room) => room.id);
      this.logger.log(`Deleting rooms with IDs: ${roomIds.join(', ')}`);
      await this.roomRepository.delete(roomIds);
    }
  }
}
