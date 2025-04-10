import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomUser } from '../room-user/room-user.entity';
import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User, RoomUser, Event])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
