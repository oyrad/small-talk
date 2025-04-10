import { useEffect } from 'react';
import { socket } from '@/socket/socket';
import { useQueryClient } from '@tanstack/react-query';
import { Room } from '@/hooks/room/use-room-details-query';

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

    const eventHandler = () => queryClient.invalidateQueries({ queryKey: ['room-events', room.id] });
    socket.on('event', eventHandler);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !socket.connected) {
        socket.connect();
        socket.emit('join-room', room.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      socket.off('event', eventHandler);
      socket.emit('leave-room', room.id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, queryClient, room]);

  return null;
}
