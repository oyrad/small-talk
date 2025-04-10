import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import { EVENT_TYPE } from '@/types/event-type';
import { useSendEventMutation } from '@/hooks/event/use-send-event-mutation';
import { socket } from '@/socket/socket';
import { useUserStore } from '@/stores/use-user-store';
import { useParams } from 'next/navigation';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const { room: roomId } = useParams<{ room: string }>();
  const { userId } = useUserStore();

  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate: sendMessage } = useSendEventMutation({
    onSuccess: (message) => {
      socket.emit('event', {
        type: EVENT_TYPE.MESSAGE,
        roomId: roomId,
        userId: userId ?? '',
        content: message.content,
      });
      setMessage('');
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    messageInputRef.current?.focus();

    if (!message.trim().length) {
      return;
    }

    sendMessage({ type: EVENT_TYPE.MESSAGE, roomId, userId: userId ?? '', content: message });
  }

  return (
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
  );
}
