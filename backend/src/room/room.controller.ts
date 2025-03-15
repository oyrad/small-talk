import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Body('userId') userId: string, @Body('name') name?: string, @Body('password') password?: string) {
    return this.roomService.createRoom(userId, name, password);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    return this.roomService.getRoomById(id);
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: string) {
    return this.roomService.deleteRoom(id);
  }

  @Post(':id/validate-password')
  async validatePassword(
    @Param('id') roomId: string,
    @Body('password') password: string,
    @Body('userId') userId: string,
  ) {
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const success = await this.roomService.validateRoomPassword(roomId, userId, password);
    return { success };
  }
}
