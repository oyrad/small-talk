import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EVENT_TYPE, EventType } from '../../types/event-type';
import { RoomUser } from '../room-user/room-user.entity';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(RoomUser)
    private readonly roomUserRepository: Repository<RoomUser>,
  ) {}

  async createEvent(type: EventType, userId: string, roomId: string, content: string) {
    this.logger.log(`Creating a new event for room ID: ${roomId}`);

    const roomUser = await this.roomUserRepository.findOne({
      where: {
        user: { id: userId },
        room: { id: roomId },
      },
      relations: ['user', 'room'],
    });

    if (!roomUser) {
      throw new NotFoundException(`RoomUser not found for user ID ${userId} in room ID ${roomId}`);
    }

    if (type === EVENT_TYPE.MESSAGE && !content) {
      throw new BadRequestException('Content is required for message event');
    }

    const event = this.eventRepository.create({
      type,
      content,
      user: roomUser,
      room: roomUser.room,
      userId: roomUser.user.id,
      alias: roomUser.alias,
    });

    const savedEvent = await this.eventRepository.save(event);

    this.logger.log(`Event of type ${type} created for room ID: ${roomId} by user ID: ${userId}`);

    return savedEvent;
  }
}
