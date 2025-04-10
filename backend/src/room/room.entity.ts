import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../event/event.entity';
import { DisappearingMessages } from '../../types/disappearing-messages';
import { RoomUser } from '../room-user/room-user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => RoomUser, (roomUser) => roomUser.room, { cascade: true })
  users: Array<RoomUser>;

  @OneToMany(() => Event, (event) => event.room)
  events: Event[];

  @Column({ nullable: true })
  disappearingMessages: DisappearingMessages;

  @CreateDateColumn()
  createdAt: Date;
}
