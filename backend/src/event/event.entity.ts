import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../room/room.entity';
import { EventType } from '../../types/event-type';
import { RoomUser } from '../room-user/room-user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: EventType;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => RoomUser, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'roomUserId' })
  user: RoomUser;

  @ManyToOne(() => Room, (room) => room.events, { onDelete: 'CASCADE' })
  room: Room;

  @Column()
  userId: string;

  @Column()
  alias: string;

  @CreateDateColumn()
  createdAt: Date;
}
