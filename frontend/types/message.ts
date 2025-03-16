import { User } from '@/types/user';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}
