import { useEffect } from 'react';
import { socket } from '@/socket/socket';
import { useQueryClient } from '@tanstack/react-query';
import { Room } from '@/types/room';

interface UseRoomSocketParams {
  room: Room | undefined;
  isAuthenticated: boolean;
}

export function useRoomSocket({ room, isAuthenticated }: UseRoomSocketParams) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!room || !isAuthenticated) {
      return;
    }

    const connectSocket = () => {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit('join-room', room.id);
    };

    connectSocket();

    const messageHandler = () => queryClient.invalidateQueries({ queryKey: ['room', room.id] });
    socket.on('message', messageHandler);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        connectSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      socket.off('message', messageHandler);
      socket.emit('leave-room', room.id);
      socket.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [room, isAuthenticated, queryClient]);

  return null;
}
