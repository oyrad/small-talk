import { User } from '@/types/user';

export interface Room {
  id: string;
  name: string | null;
  password: string | null;
  users: Array<User>;
  creator: User;
  createdAt: string;
}
