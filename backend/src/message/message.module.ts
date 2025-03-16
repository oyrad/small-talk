import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Room, User])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
