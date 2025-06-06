import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUseById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser() {
    return this.userService.createUser();
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.userService.updateUser(id, data);
  }
}
