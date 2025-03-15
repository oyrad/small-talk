import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(userId: string) {
    this.logger.log(`Fetching user by ID: ${userId}`);
    return this.userRepository.findOne({ where: { id: userId } });
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
