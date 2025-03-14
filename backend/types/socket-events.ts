export interface ServerToClientEvents {
  message: (payload: { roomId: string; content: string; userId: string; userAlias: string | null }) => void;
}

export interface ClientToServerEvents {
  'join-room': (roomId: string) => void;
  'leave-room': (roomId: string) => void;
  message: (payload: { roomId: string; content: string; userId: string; userAlias: string | null }) => void;
}
