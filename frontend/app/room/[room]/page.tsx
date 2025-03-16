'use client';

import { socket } from '@/socket';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/use-user-store';
import { MessageList } from '@/app/room/[room]/_components/MessageList';
import { useGetRoomByIdQuery } from '@/hooks/use-get-room-by-id-query';
import { PasswordPrompt, PasswordPromptFormValues } from '@/app/room/[room]/_components/PasswordPrompt';
import { useValidatePasswordMutation } from '@/hooks/use-validate-password-mutation';
import { useRoomSocket } from '@/hooks/use-room-socket';
import { useSendMessageMutation } from '@/hooks/use-send-message-mutation';
import { HeaderDropDownMenu } from '@/app/room/[room]/_components/HeaderDropDownMenu';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface MessageFormValues {
  message: string;
}

export default function Room() {
  const { room: roomId } = useParams<{ room: string }>();

  const { userId, userAlias } = useUserStore();

  const { register, handleSubmit, reset } = useForm<MessageFormValues>({
    defaultValues: { message: '' },
  });

  const { data: room } = useGetRoomByIdQuery(roomId);
  const { mutateAsync: validatePassword } = useValidatePasswordMutation(roomId);

  const isAuthenticated = !!room?.password && room.users.some((user) => user.id === userId);

  useRoomSocket({ roomId, isAuthenticated });

  const { mutate: sendMessage } = useSendMessageMutation({
    onSuccess: (message) => {
      socket.emit('message', { roomId: room?.id ?? '', content: message.content, userId: userId ?? '', userAlias });
      reset();
    },
  });

  function onMessageSubmit(values: MessageFormValues) {
    sendMessage({ roomId: room?.id ?? '', userId: userId ?? '', content: values.message });
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

  if (room?.password && !isAuthenticated) {
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

          <HeaderDropDownMenu
            onCopyLink={copyRoomLink}
            userId={userId ?? ''}
            roomCreatorId={room?.creator.id ?? ''}
            roomId={room?.id ?? ''}
          >
            <Button asChild variant="outline" className="h-full p-0">
              <Settings className="size-10 p-2" />
            </Button>
          </HeaderDropDownMenu>
        </Card>
      </header>

      <MessageList messages={room?.messages ?? []} />

      <form onSubmit={handleSubmit(onMessageSubmit)}>
        <Input {...register('message')} className="border border-gray-400 w-full" placeholder="Message" />
      </form>
    </div>
  );
}
