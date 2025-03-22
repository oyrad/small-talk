import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/use-user-store';
import { useEffect, useRef } from 'react';
import { getMessageTime } from '@/utils/get-message-time';
import { Message } from '@/types/message';

function MessageTimestamp({ timestamp }: { timestamp: string }) {
  return <p className="text-gray-400 text-[0.70rem] whitespace-nowrap">{getMessageTime(timestamp)}</p>;
}

interface MessageListProps {
  messages: Array<Message>;
}

export function MessageList({ messages }: MessageListProps) {
  const { userId } = useUserStore();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messagesEndRef.current || !messages.length) return;

    messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
  }, [messages, userId]);

  return (
    <div className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-1 relative px-2 break-words">
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.user.id !== messages[index - 1]?.user.id && (
            <p className={cn('text-gray-700 text-xs mb-1', msg.user.id === userId && 'text-right')}>
              {msg.user.alias ?? msg.user.id}
            </p>
          )}

          <div className={cn('flex gap-1 text-sm items-end', msg.user.id === userId && 'ml-auto flex-row-reverse')}>
            <Card
              key={index}
              className={cn(
                'px-3 py-1 bg-gray-200 text-black rounded-xl border-none',
                msg.user.id === userId && 'bg-gray-800 text-white',
              )}
            >
              {msg.content}
            </Card>

            <MessageTimestamp timestamp={msg.createdAt} />
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
