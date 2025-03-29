import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Controller('api/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Body('userId') userId: string, @Body('name') name?: string, @Body('password') password?: string) {
    return this.roomService.createRoom(userId, name, password);
  }

  @Get(':id')
  getRoom(@Param('id') id: string) {
    return this.roomService.getRoomById(id);
  }

  @Patch(':id')
  updateRoom(@Param('id') id: string, @Body() data: Partial<Room>) {
    return this.roomService.updateRoomById(id, data);
  }

  @Post(':id/join')
  joinRoom(@Param('id') roomId: string, @Body('userId') userId: string, @Body('password') password?: string) {
    return this.roomService.joinRoom(roomId, userId, password);
  }

  @Post(':id/leave')
  leaveRoom(@Param('id') roomId: string, @Body('userId') userId: string) {
    return this.roomService.leaveRoom(roomId, userId);
  }
}
