import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  password?: string;

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable()
  users: Array<User>;

  @ManyToOne(() => User, (user) => user.createdRooms)
  creator: User;

  @OneToMany(() => Message, (message) => message.room)
  messages: Array<Message>;

  @CreateDateColumn()
  createdAt: Date;
}
