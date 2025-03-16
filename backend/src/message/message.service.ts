import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(userId: string, roomId: string, content: string) {
    this.logger.log(`Creating a new message for room ID: ${roomId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new BadRequestException(`Room with id ${roomId} not found`);
    }

    const message = this.messageRepository.create({ content, user, room });
    const savedMessage = await this.messageRepository.save(message);

    this.logger.log(`Message created for room ID: ${roomId}`);
    return savedMessage;
  }
}
