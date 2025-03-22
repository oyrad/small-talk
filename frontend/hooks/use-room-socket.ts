import { useEffect } from 'react';
import { socket } from '@/socket/socket';
import { useQueryClient } from '@tanstack/react-query';

interface UseRoomSocketParams {
  roomId: string;
  isAuthenticated: boolean;
}

export function useRoomSocket({ roomId, isAuthenticated }: UseRoomSocketParams) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roomId || !isAuthenticated) {
      return;
    }

    const connectSocket = () => {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit('join-room', roomId);
    };

    connectSocket();

    const messageHandler = () => queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    socket.on('message', messageHandler);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !socket.connected) {
        connectSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      socket.off('message', messageHandler);
      socket.emit('leave-room', roomId);
      socket.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [roomId, isAuthenticated, queryClient]);

  return null;
}
