import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { randomUUID } from 'node:crypto';
import { hoursToMilliseconds } from 'date-fns';

const JWT_EXPIRATION_TIME = '3d';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Res({ passthrough: true }) res: Response) {
    const user = await this.userService.createUser();

    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: JWT_EXPIRATION_TIME });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: hoursToMilliseconds(72),
    });

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: hoursToMilliseconds(8760),
    });

    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') userId: string, @Body() data: Partial<User>) {
    return this.userService.updateUser(userId, data);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('Refresh token not provided');

    const user = await this.userService.getUserByRefreshToken(refreshToken);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const newJwt = this.jwtService.sign({ userId: user.id }, { expiresIn: JWT_EXPIRATION_TIME });
    const newRefreshToken = randomUUID();

    await this.userService.updateUser(user.id, { refreshToken: newRefreshToken });

    res.cookie('token', newJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: hoursToMilliseconds(72),
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: hoursToMilliseconds(8760),
    });

    return { success: true };
  }
}
