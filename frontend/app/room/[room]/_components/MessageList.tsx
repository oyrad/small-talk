import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/use-user-store';
import { useEffect, useRef } from 'react';
import { getMessageTime } from '@/utils/get-message-time';
import { Message } from '@/types/message';
import { isSameDay } from 'date-fns';
import Linkify from 'linkify-react';

function MessageTimestamp({ timestamp }: { timestamp: string }) {
  return <p className="text-gray-400 text-[0.70rem] whitespace-nowrap">{getMessageTime(timestamp)}</p>;
}

function DateMarker({ date, className = '' }: { date: string; className?: string }) {
  return (
    <p
      className={cn('text-xs text-center bg-stone-100 text-slate-800 mx-auto px-3 py-0.5 rounded-lg w-fit', className)}
    >
      {date}
    </p>
  );
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
    <div
      className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-1 relative px-2 whitespace-pre-wrap"
      style={{
        overflowWrap: 'anywhere',
      }}
    >
      {messages.map((msg, index) => (
        <div key={index}>
          {index === 0 && <DateMarker date={new Date(msg.createdAt).toLocaleDateString()} className="mb-2" />}

          {index !== 0 && !isSameDay(new Date(msg?.createdAt), new Date(messages[index - 1].createdAt)) && (
            <DateMarker date={new Date(msg.createdAt).toLocaleDateString()} className="my-3" />
          )}

          {msg.user.id !== messages[index - 1]?.user.id && (
            <p className={cn('text-gray-700 text-xs mb-1', msg.user.id === userId && 'text-right')}>
              {msg.user.alias ?? msg.user.id}
            </p>
          )}

          <div className={cn('flex gap-1 text-sm items-end', msg.user.id === userId && 'ml-auto flex-row-reverse')}>
            <Card
              key={index}
              className={cn(
                'px-3 py-1 bg-gray-200 text-black rounded-xl border-none hyphens-auto',
                msg.user.id === userId && 'bg-gray-700 text-white',
              )}
            >
              <Linkify
                options={{
                  className: msg.user.id === userId ? 'text-blue-300 underline' : 'text-blue-700 underline',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }}
              >
                {msg.content}
              </Linkify>
            </Card>

            <MessageTimestamp timestamp={msg.createdAt} />
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
