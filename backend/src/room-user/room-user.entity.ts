import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.rooms)
  user: User;

  @ManyToOne(() => Room, (room) => room.users, { onDelete: 'CASCADE' })
  room: Room;

  @Column()
  isAdmin: boolean;

  @CreateDateColumn()
  joinedAt: Date;
}
