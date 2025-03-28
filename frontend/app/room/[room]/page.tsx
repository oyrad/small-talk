'use client';

import { socket } from '@/socket/socket';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/use-user-store';
import { MessageList } from '@/app/room/[room]/_components/MessageList';
import { useGetRoomByIdQuery } from '@/hooks/use-get-room-by-id-query';
import { PasswordPrompt, PasswordPromptFormValues } from '@/app/room/[room]/_components/PasswordPrompt';
import { useValidatePasswordMutation } from '@/hooks/use-validate-password-mutation';
import { useRoomSocket } from '@/hooks/use-room-socket';
import { useSendMessageMutation } from '@/hooks/use-send-message-mutation';
import { RoomSettings } from '@/app/room/[room]/_components/RoomSettings';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useJoinRoomMutation } from '@/hooks/use-join-room-mutation';
import { Loader } from '@/app/_components/Loader';

export default function Room() {
  const [message, setMessage] = useState('');
  const { room: roomId } = useParams<{ room: string }>();

  const { userId, userAlias } = useUserStore();
  const { push } = useRouter();
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  const { data: room, isPending: isRoomLoading, error: roomError } = useGetRoomByIdQuery(roomId);

  const { mutateAsync: validatePassword } = useValidatePasswordMutation(roomId);
  const { mutate: joinRoom } = useJoinRoomMutation();

  const isAuthenticated = !room?.hasPassword || (room && room.users.some((user) => user.id === userId));

  useRoomSocket({ room, isAuthenticated });

  const { mutate: sendMessage } = useSendMessageMutation({
    onSuccess: (message) => {
      socket.emit('message', { roomId: room?.id ?? '', content: message.content, userId: userId ?? '', userAlias });
      setMessage('');
    },
  });

  useEffect(() => {
    if (room && !room.hasPassword && !room.users.find((user) => user.id === userId)) {
      joinRoom({ roomId, userId: userId ?? '' });
    }
  }, [joinRoom, room, roomId, userId]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    messageInputRef.current?.focus();

    if (!message.trim().length) {
      return;
    }

    sendMessage({ roomId: room?.id ?? '', userId: userId ?? '', content: message });
  }

  function copyRoomLink() {
    void navigator.clipboard.writeText(window.location.href);
    toast('Room link copied.');
  }

  async function onValidatePassword({ password }: PasswordPromptFormValues) {
    const res = await validatePassword({ userId: userId ?? '', password });

    if (!res.success) {
      toast.error('Invalid password');
    }
  }

  if (isRoomLoading) {
    return <Loader />;
  }

  if (!room || roomError) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 p-8 h-full">
        <h1 className="text-6xl">404 Room not found</h1>
        <Button onClick={() => push('/')} className="w-full">
          Home
        </Button>
      </div>
    );
  }

  if (room?.hasPassword && !isAuthenticated) {
    return <PasswordPrompt onValidatePassword={onValidatePassword} />;
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <header>
        <Card className="flex flex-row justify-between items-center p-2 pl-4">
          {room && room.name ? (
            <div onClick={copyRoomLink}>
              <h1 className="text-lg font-semibold">{room.name}</h1>
              <p className="text-xs text-gray-500">{room.id}</p>
            </div>
          ) : (
            <h1 className="text-sm font-semibold cursor-pointer justify-self-start w-fit" onClick={copyRoomLink}>
              {room?.id}
            </h1>
          )}

          <RoomSettings onCopyLink={copyRoomLink} userId={userId ?? ''} room={room} />
        </Card>
      </header>

      <MessageList messages={room?.messages ?? []} />

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
