import { useEffect, useState } from 'react';
import { Message } from '@/types/message';
import { socket } from '@/socket';
import { ServerToClientEvents } from '@/types/socket-events';

interface UseRoomSocketParams {
  roomId: string;
  isAuthenticated: boolean;
}

export function useRoomSocket({ roomId, isAuthenticated }: UseRoomSocketParams) {
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    if (!roomId || !isAuthenticated) {
      return;
    }

    socket.emit('join-room', roomId);

    const messageHandler = (message: Parameters<ServerToClientEvents['message']>[0]) => {
      setMessages((prev) => [...prev, { ...message, timestamp: new Date().toISOString() }]);
    };

    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
      socket.emit('leave-room', roomId);
    };
  }, [roomId, isAuthenticated]);

  return { messages };
}
