import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../room/room.entity';
import { Repository } from 'typeorm';
import { minutesToMilliseconds } from 'date-fns';

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
      .having('(COUNT(users.id) = 1 AND COUNT(messages.id) = 0) OR COUNT(users.id) = 0')
      .select('room.id')
      .getMany();

    if (rooms.length > 0) {
      const roomIds = rooms.map((room) => room.id);
      this.logger.log(`Deleting rooms with IDs: ${roomIds.join(', ')}`);
      await this.roomRepository.delete(roomIds);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'delete-messages',
    timeZone: 'Europe/Zagreb',
  })
  async deleteMessages() {
    this.logger.log(`Deleting messages in rooms with disappearing messages enabled`);
    const rooms = await this.roomRepository.find({ where: { disappearingMessages: true }, relations: ['messages'] });

    for (const room of rooms) {
      const messagesToDelete = room.messages.filter((message) => {
        const diff = new Date().getTime() - message.createdAt.getTime();
        return diff > minutesToMilliseconds(30);
      });

      if (messagesToDelete.length > 0) {
        const messageIds = messagesToDelete.map((message) => message.id);
        this.logger.log(`Deleting messages with IDs: ${messageIds.join(', ')}`);
        await this.roomRepository.createQueryBuilder().relation(Room, 'messages').of(room).remove(messageIds);
      }
    }
  }
}
