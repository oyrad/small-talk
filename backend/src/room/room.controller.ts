import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { DisappearingMessages } from '../../types/disappearing-messages';
import { RoomUser } from '../room-user/room-user.entity';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(AuthGuard)
  createRoom(
    @Req() req: Request,
    @Body('name') name: string,
    @Body('password') password: string,
    @Body('disappearingMessages') disappearingMessages: DisappearingMessages | null,
  ) {
    const userId = req['userId'];
    return this.roomService.createRoom(userId, name, password, disappearingMessages);
  }

  @Get(':id/details')
  @UseGuards(AuthGuard)
  getRoomDetails(@Param('id') id: string) {
    return this.roomService.getRoomDetails(id);
  }

  @Get(':id/events')
  @UseGuards(AuthGuard)
  getRoomEvents(@Param('id') id: string) {
    return this.roomService.getRoomEvents(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateRoom(@Param('id') id: string, @Body() data: Partial<Room>) {
    return this.roomService.updateRoomById(id, data);
  }

  @Post(':id/join')
  @UseGuards(AuthGuard)
  async joinRoom(
    @Req() req: Request,
    @Param('id') roomId: string,
    @Body('password') password?: string,
  ) {
    const userId = req['userId'];

    return this.roomService.joinRoom(roomId, userId, password);
  }

  @Delete(':id/leave')
  @UseGuards(AuthGuard)
  leaveRoom(@Param('id') roomId: string, @Req() req: Request) {
    const userId = req['userId'];

    return this.roomService.leaveRoom(roomId, userId);
  }

  @Patch(':roomId/user/:userId')
  @UseGuards(AuthGuard)
  updateRoomUser(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
    @Body() data: Partial<RoomUser>,
  ) {
    return this.roomService.updateRoomUser(roomId, userId, data);
  }
}
