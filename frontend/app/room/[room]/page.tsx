'use client';

import { socket } from '@/socket/socket';
import { useUserStore } from '@/stores/use-user-store';
import { MessageList } from '@/app/room/[room]/_components/MessageList';
import { useRoomDetailsQuery } from '@/hooks/room/use-room-details-query';
import { PasswordPrompt } from '@/app/room/[room]/_components/PasswordPrompt';
import { useRoomSocket } from '@/hooks/room/use-room-socket';
import { Info } from 'lucide-react';
import { useEffect } from 'react';
import { useJoinRoomMutation } from '@/hooks/room/use-join-room-mutation';
import { Loader } from '@/app/_components/Loader';
import { RoomHeader } from '@/app/room/[room]/_components/RoomHeader';
import { RoomNotFound } from '@/app/room/[room]/_components/RoomNotFound';
import { EVENT_TYPE } from '@/types/event-type';
import { toast } from 'sonner';
import { useRoomEventsQuery } from '@/hooks/room/use-room-events-query';
import { useQueryClient } from '@tanstack/react-query';
import { MessageInput } from '@/app/room/[room]/_components/MessageInput';
import { useParams } from 'next/navigation';

export default function Room() {
  const queryClient = useQueryClient();
  const { room: roomId } = useParams<{ room: string }>();

  const { userId } = useUserStore();

  const { data: room, isPending: isRoomLoading, error: roomError } = useRoomDetailsQuery(roomId);

  const { mutateAsync: joinRoom } = useJoinRoomMutation({
    onSuccess: () => {
      socket.emit('event', {
        type: EVENT_TYPE.USER_JOINED,
        roomId: room?.id ?? '',
        userId: userId ?? '',
      });
    },
  });

  const isPasswordProtected = !!room?.hasPassword;
  const isUserInRoom = !!room?.users.find((roomUser) => roomUser.userId === userId);
  const isAuthenticated = !isPasswordProtected || isUserInRoom;

  useRoomSocket({ room, isAuthenticated });
  const { data: events } = useRoomEventsQuery(roomId, {
    enabled: room ? isAuthenticated : false,
  });

  useEffect(() => {
    if (userId && room && !isPasswordProtected && !isUserInRoom) {
      void joinRoom({ roomId: room.id, userId: userId });
    }
  }, [isPasswordProtected, isUserInRoom, joinRoom, room, userId]);

  if (isRoomLoading) {
    return <Loader />;
  }

  if (!room || roomError) {
    return <RoomNotFound />;
  }

  if (room.hasPassword && !isAuthenticated) {
    return (
      <PasswordPrompt
        onPasswordSubmit={async ({ password }) => {
          const res = await joinRoom({ roomId, userId: userId ?? '', password });

          if (!res.success) {
            toast.error('Invalid password');
            return;
          }

          return queryClient.invalidateQueries({ queryKey: ['room-details', roomId] });
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <RoomHeader room={room} />

      {room.disappearingMessages && (
        <div className="text-xs flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 mx-4">
          <Info className="size-5 min-w-5 text-gray-600" />
          <p className="text-gray-800">
            Disappearing messages are enabled. Messages will be deleted{' '}
            <span className="font-semibold">{room.disappearingMessages}</span> after sending.
          </p>
        </div>
      )}

      <MessageList events={events ?? []} />

      <MessageInput />
    </div>
  );
}
