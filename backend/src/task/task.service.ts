import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../room/room.entity';
import { Repository } from 'typeorm';
import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import { DISAPPEARING_MESSAGES } from '../../types/disappearing-messages';

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
      .leftJoinAndSelect('room.users', 'roomUsers')
      .leftJoinAndSelect('room.events', 'events')
      .groupBy('room.id')
      .having('(COUNT(roomUsers.id) = 1 AND COUNT(events.id) = 0) OR COUNT(roomUsers.id) = 0')
      .select('room.id')
      .getMany();

    if (rooms.length > 0) {
      const roomIds = rooms.map((room) => room.id);
      this.logger.log(`Deleting rooms with IDs: ${roomIds.join(', ')}`);
      await this.roomRepository.delete(roomIds);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'delete-messages-ten-minutes',
    timeZone: 'Europe/Zagreb',
  })
  async disappearingMessagesTenMinutes() {
    this.logger.log(`Deleting events in rooms with disappearing messages set to 10 minutes`);
    const rooms = await this.roomRepository.find({
      where: { disappearingMessages: DISAPPEARING_MESSAGES.TEN_MINUTES },
      relations: ['events'],
    });

    void this.deleteEvents(rooms, minutesToMilliseconds(10));
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'delete-messages-thirty-minutes',
    timeZone: 'Europe/Zagreb',
  })
  async disappearingMessagesThirtyMinutes() {
    this.logger.log(`Deleting events in rooms with disappearing messages set to 30 minutes`);
    const rooms = await this.roomRepository.find({
      where: { disappearingMessages: DISAPPEARING_MESSAGES.THIRTY_MINUTES },
      relations: ['events'],
    });

    void this.deleteEvents(rooms, minutesToMilliseconds(30));
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'delete-messages-one-hour',
    timeZone: 'Europe/Zagreb',
  })
  async disappearingMessagesOneHour() {
    this.logger.log(`Deleting events in rooms with disappearing messages set to 1 hour`);
    const rooms = await this.roomRepository.find({
      where: { disappearingMessages: DISAPPEARING_MESSAGES.ONE_HOUR },
      relations: ['events'],
    });

    void this.deleteEvents(rooms, hoursToMilliseconds(1));
  }

  @Cron(CronExpression.EVERY_30_MINUTES, {
    name: 'delete-messages-one-day',
    timeZone: 'Europe/Zagreb',
  })
  async disappearingMessagesOneDay() {
    this.logger.log(`Deleting events in rooms with disappearing messages set to 1 day`);
    const rooms = await this.roomRepository.find({
      where: { disappearingMessages: DISAPPEARING_MESSAGES.ONE_DAY },
      relations: ['events'],
    });

    void this.deleteEvents(rooms, hoursToMilliseconds(24));
  }

  async deleteEvents(rooms: Array<Room>, differenceThresholdInMs: number) {
    for (const room of rooms) {
      const eventsToDelete = room.events.filter((evt) => {
        const diff = new Date().getTime() - evt.createdAt.getTime();
        return diff > differenceThresholdInMs;
      });

      if (eventsToDelete.length > 0) {
        const messageIds = eventsToDelete.map((evt) => evt.id);
        this.logger.log(`Deleting events with IDs: ${messageIds.join(', ')}`);
        await this.roomRepository.createQueryBuilder().relation(Room, 'events').of(room).remove(messageIds);
      }
    }
  }
}
