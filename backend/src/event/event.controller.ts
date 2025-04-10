import { Body, Controller, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { EventType } from '../../types/event-type';

@Controller('api/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post(':id')
  createEvent(
    @Param('id') roomId: string,
    @Body('type') type: EventType,
    @Body('userId') userId: string,
    @Body('content') content: string | null,
  ) {
    return this.eventService.createEvent(type, userId, roomId, content);
  }
}
