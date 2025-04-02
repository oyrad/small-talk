import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomUser } from './room-user.entity';

@Module({ imports: [TypeOrmModule.forFeature([RoomUser])], exports: [TypeOrmModule] })
export class RoomUserModule {}
