import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser() {
    return this.userService.createUser();
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.userService.updateUser(id, data);
  }
}
