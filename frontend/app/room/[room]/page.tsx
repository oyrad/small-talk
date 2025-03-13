'use client';

import { socket } from '@/socket';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/use-user-store';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageList } from '@/app/room/[room]/_components/MessageList';
import { ServerToClientEvents } from '@/types/socket-events';

export interface Message {
  roomId: string;
  content: string;
  userId: string;
  userAlias: string;
  timestamp: string;
}

interface MessageFormValues {
  message: string;
}

export default function Room() {
  const { room: roomId } = useParams<{ room: string }>();
  const [messages, setMessages] = useState<Array<Message>>([]);

  const { userId, userAlias } = useUserStore();

  const { register, handleSubmit, reset } = useForm<MessageFormValues>({
    defaultValues: { message: '' },
  });

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

  function onSubmit(values: MessageFormValues) {
    socket.emit('message', { roomId, content: values.message, userId, userAlias });
    reset();
  }

  function copyRoomLink() {
    void navigator.clipboard.writeText(window.location.href);
    toast('Room link copied.');
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <header>
        <Card className="flex flex-row justify-between items-center p-2 pl-4">
          <h1 className="text-sm font-semibold cursor-pointer justify-self-start w-fit" onClick={copyRoomLink}>
            {roomId}
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Settings className="border border-gray-200 size-10 rounded-md p-2" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mr-4">
              <DropdownMenuItem onClick={copyRoomLink}>Copy room link</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600">Delete room</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </header>

      <MessageList messages={messages} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('message')} className="border border-gray-400 w-full" placeholder="Message" />
      </form>
    </div>
  );
}
