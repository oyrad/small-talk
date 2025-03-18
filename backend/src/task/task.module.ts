import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../room/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [TaskService],
})
export class TaskModule {}
