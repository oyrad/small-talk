import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { DisappearingMessages } from '../../types/disappearing-messages';
import { RoomUser } from '../room-user/room-user.entity';

@Controller('api/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(
    @Body('userId') userId: string,
    @Body('name') name: string,
    @Body('password') password: string,
    @Body('disappearingMessages') disappearingMessages: DisappearingMessages | null,
  ) {
    return this.roomService.createRoom(userId, name, password, disappearingMessages);
  }

  @Get(':id/details')
  getRoomDetails(@Param('id') id: string) {
    return this.roomService.getRoomDetails(id);
  }

  @Get(':id/events')
  getRoomEvents(@Param('id') id: string) {
    return this.roomService.getRoomEvents(id);
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

  @Patch(':roomId/user/:userId')
  updateRoomUser(@Param('roomId') roomId: string, @Param('userId') userId: string, @Body() data: Partial<RoomUser>) {
    console.log({ roomId, userId, data });
    return this.roomService.updateRoomUser(roomId, userId, data);
  }
}
