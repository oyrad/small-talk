import { DisappearingMessages } from '@/types/disappearing-messages';

export interface User {
  id: string;
  alias: string;
  rooms: Array<{
    id: string;
    name: string;
    disappearingMessages: DisappearingMessages | null;
    createdAt: string;
    joinedAt: string;
    isAdmin: boolean;
  }>;
  createdAt: string;
}
