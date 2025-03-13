import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/use-user-store';
import { Message } from '@/app/room/[room]/page';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Array<Message>;
}

export function MessageList({ messages }: MessageListProps) {
  const { userId } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current && messages[messages.length - 1]?.userId === userId) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages, userId]);

  return (
    <div className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-1">
      {messages.map((msg, index) => (
        <>
          {msg.userId !== messages[index - 1]?.userId && (
            <p className={cn('text-gray-500 text-xs', msg.userId === userId && 'text-right')}>
              {msg.userAlias.length ? msg.userAlias : msg.userId}
            </p>
          )}

          <div
            className={cn(
              'flex gap-1.5 text-sm w-fit max-w-[70%] items-center',
              msg.userId === userId && 'place-self-end',
            )}
          >
            {msg.userId === userId && (
              <p className="italic text-gray-500 text-xs">
                {new Date(msg.timestamp).getHours()}:{new Date(msg.timestamp).getMinutes()}
              </p>
            )}

            <Card
              key={index}
              className={cn(
                ' px-3 py-1 bg-gray-200 text-black rounded-full border-none',
                msg.userId === userId && 'bg-gray-700 text-white',
              )}
            >
              {msg.content}
            </Card>

            {msg.userId !== userId && (
              <p className="italic text-gray-500 text-xs">
                {new Date(msg.timestamp).getHours()}:{new Date(msg.timestamp).getMinutes()}
              </p>
            )}
          </div>
        </>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
