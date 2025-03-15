'use client';

import { socket } from '@/socket';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/use-user-store';
import { Settings } from 'lucide-react';
import { MessageList } from '@/app/room/[room]/_components/MessageList';
import { ServerToClientEvents } from '@/types/socket-events';
import { useGetRoomByIdQuery } from '@/hooks/use-get-room-by-id-query';
import { useDeleteRoomMutation } from '@/hooks/use-delete-room-mutation';
import { PasswordPrompt, PasswordPromptFormValues } from '@/app/room/[room]/_components/PasswordPrompt';
import { HeaderDropDownMenu } from '@/app/room/[room]/_components/HeaderDropDownMenu';
import { Button } from '@/components/ui/button';
import { useValidatePasswordMutation } from '@/hooks/use-validate-password-mutation';

export interface Message {
  roomId: string;
  content: string;
  userId: string;
  userAlias: string | null;
  timestamp: string;
}

interface MessageFormValues {
  message: string;
}

export default function Room() {
  const { room: roomId } = useParams<{ room: string }>();
  const [messages, setMessages] = useState<Array<Message>>([]);

  const { userId, userAlias } = useUserStore();
  const { push } = useRouter();

  const { register, handleSubmit, reset } = useForm<MessageFormValues>({
    defaultValues: { message: '' },
  });

  const { data: room } = useGetRoomByIdQuery(roomId);
  const { mutate: deleteRoom } = useDeleteRoomMutation({
    onSuccess: () => {
      push('/');
    },
  });

  const isUserInRoom = room?.users.includes(userId);

  const { mutateAsync: validatePassword } = useValidatePasswordMutation(roomId);

  useEffect(() => {
    if (roomId) {
      socket.emit('join-room', roomId);

      const messageHandler = (message: Parameters<ServerToClientEvents['message']>[0]) => {
        setMessages((prev) => [...prev, { ...message, timestamp: new Date().toISOString() }]);
      };

      socket.on('message', messageHandler);

      return () => {
        socket.off('message', messageHandler);
        socket.emit('leave-room', roomId);
      };
    }
  }, [roomId]);

  function onMessageSubmit(values: MessageFormValues) {
    socket.emit('message', { roomId: room?.id ?? '', content: values.message, userId, userAlias });
    reset();
  }

  function copyRoomLink() {
    void navigator.clipboard.writeText(window.location.href);
    toast('Room link copied.');
  }

  async function onValidatePassword({ password }: PasswordPromptFormValues) {
    const res = await validatePassword({ userId, password });

    if (!res.success) {
      toast.error('Invalid password');
    }
  }

  if (room?.password && !isUserInRoom) {
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

          <HeaderDropDownMenu onCopyLink={copyRoomLink} onRoomDelete={() => deleteRoom(roomId)}>
            <Button asChild variant="outline" className="h-full">
              <Settings className="size-14" />
            </Button>
          </HeaderDropDownMenu>
        </Card>
      </header>

      <MessageList messages={messages} />

      <form onSubmit={handleSubmit(onMessageSubmit)}>
        <Input {...register('message')} className="border border-gray-400 w-full" placeholder="Message" />
      </form>
    </div>
  );
}
