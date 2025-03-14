import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/use-user-store';
import { Message } from '@/app/room/[room]/page';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatISO9075 } from 'date-fns';

function MessageTimestamp({ timestamp }: { timestamp: string }) {
  return (
    <p className="italic text-gray-500 text-xs">
      {formatISO9075(new Date(timestamp), { representation: 'time' }).substring(0, 5)}
    </p>
  );
}

interface MessageListProps {
  messages: Array<Message>;
}

export function MessageList({ messages }: MessageListProps) {
  const [showNewMessagesBanner, setShowNewMessagesBanner] = useState(false);
  const { userId } = useUserStore();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messagesEndRef.current || !messageListRef.current || !messages.length) return;

    if (messages[messages.length - 1]?.userId === userId) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
      setShowNewMessagesBanner(false);
    } else {
      const isAtBottom =
        messageListRef.current.scrollHeight <=
        messageListRef.current.scrollTop + messageListRef.current.clientHeight + 5;

      if (isAtBottom) return;

      setShowNewMessagesBanner(true);
    }
  }, [messages, userId]);

  const handleScroll = () => {
    if (!messageListRef.current) return;

    const bottom =
      messageListRef.current.scrollHeight === messageListRef.current.scrollTop + messageListRef.current.clientHeight;

    if (bottom) {
      setShowNewMessagesBanner(false);
    }
  };

  return (
    <div
      ref={messageListRef}
      className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-1 relative"
      onScroll={handleScroll}
    >
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.userId !== messages[index - 1]?.userId && (
            <p className={cn('text-gray-700 text-xs mb-1', msg.userId === userId && 'text-right')}>
              {msg.userAlias ?? msg.userId}
            </p>
          )}

          <div
            className={cn(
              'flex gap-1.5 text-sm w-fit max-w-[70%] items-center',
              msg.userId === userId && 'place-self-end',
            )}
          >
            {msg.userId === userId && <MessageTimestamp timestamp={msg.timestamp} />}

            <Card
              key={index}
              className={cn(
                ' px-3 py-1 bg-gray-200 text-black rounded-full border-none',
                msg.userId === userId && 'bg-gray-700 text-white',
              )}
            >
              {msg.content}
            </Card>

            {msg.userId !== userId && <MessageTimestamp timestamp={msg.timestamp} />}
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />

      {showNewMessagesBanner && (
        <Button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setShowNewMessagesBanner(false);
          }}
          className="fixed bottom-16 left-[50%] transform -translate-x-1/2"
          variant="outline"
        >
          New message
        </Button>
      )}
    </div>
  );
}
