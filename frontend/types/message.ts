export interface Message {
  roomId: string;
  content: string;
  userId: string;
  userAlias: string | null;
  timestamp: string;
}
