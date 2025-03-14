import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Body('name') name?: string, @Body('password') password?: string) {
    return this.roomService.createRoom(name, password);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    return this.roomService.getRoomById(id);
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: string) {
    return this.roomService.deleteRoom(id);
  }
}
