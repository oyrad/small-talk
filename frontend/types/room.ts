import { Message } from '@/types/message';

export interface Room {
  id: string;
  name: string | null;
  hasPassword: boolean;
  users: Array<{
    id: string;
    isAdmin: boolean;
    joinedAt: string;
    userId: string;
    alias: string;
  }>;
  messages: Array<Message>;
  disappearingMessages: boolean;
  createdAt: string;
}
