import { cn } from '@/lib/utils';
import Linkify from 'linkify-react';
import { Event } from '@/hooks/room/use-room-events-query';
import { useUserStore } from '@/stores/use-user-store';
import { getMessageTime } from '@/utils/get-message-time';

function MessageTimestamp({ timestamp }: { timestamp: string }) {
  return <p className="text-gray-400 text-[0.70rem] whitespace-nowrap">{getMessageTime(timestamp)}</p>;
}

interface MessageProps {
  event: Event;
  shouldShowAlias: boolean;
}

export function Message({ event, shouldShowAlias }: MessageProps) {
  const { userId } = useUserStore();

  const isOwn = event.user.userId === userId;

  return (
    <div className="flex flex-col gap-0.5">
      {shouldShowAlias && (
        <p className={cn('text-gray-700 text-xs mb-1', isOwn && 'text-right')}>
          {event.user.alias ?? event.user.userId}
        </p>
      )}

      <div
        className={cn('flex gap-1 text-sm items-end', isOwn && 'ml-auto flex-row-reverse', !shouldShowAlias && '-mt-1')}
      >
        <p
          className={cn('px-3 py-1 rounded-xl bg-gray-200 text-black hyphens-auto', isOwn && 'bg-gray-700 text-white')}
        >
          <Linkify
            options={{
              className: isOwn ? 'text-blue-300 underline' : 'text-blue-700 underline',
              target: '_blank',
              rel: 'noopener noreferrer',
            }}
          >
            {event.content}
          </Linkify>
        </p>
        <MessageTimestamp timestamp={event.createdAt} />
      </div>
    </div>
  );
}
