import { io } from 'socket.io-client';

export const socket = io('http://localhost:5542', {
  transports: ['websocket'],
});
