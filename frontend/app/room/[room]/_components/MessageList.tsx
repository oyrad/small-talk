import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/use-user-store';
import { Message } from '@/app/room/[room]/page';

interface MessageListProps {
  messages: Array<Message>;
}

export function MessageList({ messages }: MessageListProps) {
  const { userId } = useUserStore();

  return (
    <div className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-1">
      {messages.map((msg, index) => (
        <Card
          key={index}
          className={cn(
            'text-sm w-fit max-w-[70%] px-3 py-1 bg-gray-200 text-black rounded-full border-none',
            msg.userId === userId && 'place-self-end bg-gray-700 text-white',
          )}
        >
          {msg.content}
        </Card>
      ))}
    </div>
  );
}
