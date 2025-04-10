import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { RoomUser } from '../room-user/room-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, RoomUser])],
  controllers: [EventController],
  providers: [EventService],
  exports: [TypeOrmModule],
})
export class EventModule {}
