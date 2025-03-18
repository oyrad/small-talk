import { Body, Controller, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('api/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post(':id')
  async createMessage(@Param('id') roomId: string, @Body('userId') userId: string, @Body('content') content: string) {
    return this.messageService.createMessage(userId, roomId, content);
  }
}
