import { User } from '@/types/user';
import { Message } from '@/types/message';

export interface Room {
  id: string;
  name: string | null;
  hasPassword: boolean;
  users: Array<User>;
  messages: Array<Message>;
  creator: User;
  createdAt: string;
}
