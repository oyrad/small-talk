import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomUser } from '../room-user/room-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  alias: string;

  @OneToMany(() => RoomUser, (roomUser) => roomUser.user, { cascade: true })
  rooms: Array<RoomUser>;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;
}
