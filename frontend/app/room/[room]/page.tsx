'use client';

import { socket } from '@/socket/socket';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/stores/use-user-store';
import { MessageList } from '@/app/room/[room]/_components/MessageList';
import { useGetRoomByIdQuery } from '@/hooks/use-get-room-by-id-query';
import { PasswordPrompt } from '@/app/room/[room]/_components/PasswordPrompt';
import { useRoomSocket } from '@/hooks/use-room-socket';
import { useSendMessageMutation } from '@/hooks/use-send-message-mutation';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useJoinRoomMutation } from '@/hooks/use-join-room-mutation';
import { Loader } from '@/app/_components/Loader';
import { RoomHeader } from '@/app/room/[room]/_components/RoomHeader';
import { RoomNotFound } from '@/app/room/[room]/_components/RoomNotFound';

export default function Room() {
  const [message, setMessage] = useState('');
  const { room: roomId } = useParams<{ room: string }>();

  const { userId, userAlias } = useUserStore();
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  const { data: room, isPending: isRoomLoading, error: roomError } = useGetRoomByIdQuery(roomId);

  const { mutate: joinRoom } = useJoinRoomMutation();

  const isPasswordProtected = !!room?.hasPassword;
  const isUserInRoom = !!room?.users.find((user) => user.id === userId);
  const isAuthenticated = !isPasswordProtected || isUserInRoom;

  useRoomSocket({ room, isAuthenticated });

  const { mutate: sendMessage } = useSendMessageMutation({
    onSuccess: (message) => {
      socket.emit('message', { roomId: room?.id ?? '', content: message.content, userId: userId ?? '', userAlias });
      setMessage('');
    },
  });

  useEffect(() => {
    if (userId && room && !isPasswordProtected && !isUserInRoom) {
      joinRoom({ roomId: room.id, userId: userId });
    }
  }, [isPasswordProtected, isUserInRoom, joinRoom, room, userId]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    messageInputRef.current?.focus();

    if (!message.trim().length) {
      return;
    }

    sendMessage({ roomId: room?.id ?? '', userId: userId ?? '', content: message });
  }

  if (isRoomLoading) {
    return <Loader />;
  }

  if (!room || roomError) {
    return <RoomNotFound />;
  }

  if (room.hasPassword && !isAuthenticated) {
    return <PasswordPrompt />;
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <RoomHeader room={room} />

      <MessageList room={room} />

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(
            'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          )}
          placeholder="Message"
          maxRows={4}
          ref={messageInputRef}
        />
        <Button>
          <Send />
        </Button>
      </form>
    </div>
  );
}
