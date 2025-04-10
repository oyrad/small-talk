import { EventType } from '@/types/event-type';

export interface ServerToClientEvents {
  event: (payload: { type: EventType; roomId: string; userId: string; content?: string }) => void;
}

export interface ClientToServerEvents {
  'join-room': (roomId: string) => void;
  'leave-room': (roomId: string) => void;
  event: (payload: { type: EventType; roomId: string; userId: string; content?: string }) => void;
}
