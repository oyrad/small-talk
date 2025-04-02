import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { compareAsc } from 'date-fns';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(userId: string) {
    this.logger.log(`Fetching user by ID: ${userId}`);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['rooms', 'rooms.room'],
    });

    if (!user) throw new NotFoundException('User not found');

    const sortedRooms = user.rooms
      .map((roomUser) => ({
        id: roomUser.room.id,
        name: roomUser.room.name,
        disappearingMessages: roomUser.room.disappearingMessages,
        createdAt: roomUser.room.createdAt,
        joinedAt: roomUser.joinedAt,
        isAdmin: roomUser.isAdmin,
      }))
      .sort((a, b) => compareAsc(a.joinedAt, b.joinedAt));

    return { ...user, rooms: sortedRooms };
  }

  async createUser() {
    this.logger.log('Creating a new user');

    const user = this.userRepository.create();
    const savedUser = await this.userRepository.save(user);

    this.logger.log(`User created with ID: ${savedUser.id}`);

    return savedUser;
  }

  async updateUser(userId: string, data: Partial<User>) {
    this.logger.log('Updating user');

    await this.userRepository.update(userId, data);
    const updatedUser = await this.getUserById(userId);

    this.logger.log(`User updated with ID: ${updatedUser.id}`);

    return updatedUser;
  }
}
