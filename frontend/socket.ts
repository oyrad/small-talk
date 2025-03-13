import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket-events';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:5542', {
  transports: ['websocket'],
});
