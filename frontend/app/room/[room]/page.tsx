'use client';

import { socket } from '@/socket';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { v4 } from 'uuid';
import { cn } from '@/lib/utils';

const user = v4();

interface MessageFormValues {
  message: string;
}

export default function Room() {
  const { room } = useParams<{ room: string }>();

  const [messages, setMessages] = useState<{ msg: string; user: string }[]>([]);

  const { register, handleSubmit, reset } = useForm<MessageFormValues>({
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (room) {
      socket.emit('join-room', room);

      socket.on('message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off('message');
    };
  }, [room]);

  function onSubmit(values: MessageFormValues) {
    socket.emit('message', { room, message: values.message, user });
    reset();
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2">
        {messages.reverse().map((msg, index) => (
          <Card
            key={index}
            className={cn(
              'w-fit max-w-[70%] px-4 py-1 bg-gray-200 text-black rounded-full',
              msg.user === user && 'place-self-end bg-gray-700 text-white',
            )}
          >
            {msg.msg}
          </Card>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('message')} className="border border-gray-700 w-full" autoComplete="off" placeholder="Message" />
      </form>
    </div>
  );
}
