import { useEffect } from 'react';
import { socket } from '@/socket';
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

    socket.emit('join-room', roomId);

    const messageHandler = () => queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
      socket.emit('leave-room', roomId);
    };
  }, [roomId, isAuthenticated]);

  return null;
}
