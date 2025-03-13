import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../../types/socket-events';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: TypedSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: TypedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: TypedSocket, roomId: string) {
    console.log('join room event');
    client.join(roomId);
    console.log(`Client ${client.id} joined room: ${roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: TypedSocket, roomId: string) {
    client.leave(roomId);
    console.log(`Client ${client.id} left room: ${roomId}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: TypedSocket, payload: Parameters<ClientToServerEvents['message']>[0]) {
    const { userId, userAlias, roomId, content } = payload;

    this.server.to(roomId).emit('message', {
      roomId,
      content,
      userId,
      userAlias,
    });
  }
}
