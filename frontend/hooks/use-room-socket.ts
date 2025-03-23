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
    if (!room || !isAuthenticated) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join-room', room.id);

    const messageHandler = () => queryClient.invalidateQueries({ queryKey: ['room', room.id] });
    socket.on('message', messageHandler);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !socket.connected) {
        socket.connect();
        socket.emit('join-room', room.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      socket.off('message', messageHandler);
      socket.emit('leave-room', room.id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [room?.id, isAuthenticated, queryClient]);

  return null;
}
