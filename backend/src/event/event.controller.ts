import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { EventType } from '../../types/event-type';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('api/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  createEvent(
    @Req() req: Request,
    @Param('id') roomId: string,
    @Body('type') type: EventType,
    @Body('content') content: string | null,
  ) {
    const userId = req['userId'];

    return this.eventService.createEvent(type, userId, roomId, content);
  }
}
