import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../room/room.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  alias: string;

  @ManyToMany(() => Room, (room) => room.users)
  rooms: Array<Room>;

  @OneToMany(() => Room, (room) => room.creator)
  createdRooms: Array<Room>;

  @CreateDateColumn()
  createdAt: Date;
}
