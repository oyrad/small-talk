import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  password?: string;

  @Column('text', { array: true, default: [] })
  users: Array<string>;

  @CreateDateColumn()
  createdAt: Date;
}
