import { useEffect, useRef } from 'react';
import { isSameDay, isToday, isYesterday } from 'date-fns';

import { cn } from '@/utils/cn';
import { useUserStore } from '@/stores/use-user-store';
import { EVENT_TYPE } from '@/types/event-type';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/hooks/room/use-room-events-query';
import { Message } from '@/app/room/[room]/_components/Message';

function SystemEvent({ text, className }: { text: string; className: string }) {
  return (
    <p className={cn('mx-auto my-1.5 text-center text-xs px-2.5 py-0.5 rounded-xl', className)}>
      {text}
    </p>
  );
}

function DateMarker({ date, className = '' }: { date: string; className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn('mx-auto px-3 py-0.5 rounded-lg w-fit mb-1.5', className)}
    >
      {isToday(new Date(date))
        ? 'Today'
        : isYesterday(new Date(date))
          ? 'Yesterday'
          : new Date(date).toLocaleDateString()}
    </Badge>
  );
}

interface MessageListProps {
  events: Array<Event>;
}

export function MessageList({ events }: MessageListProps) {
  const { userId } = useUserStore();
  const eventsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!eventsEndRef.current || !events.length) return;

    eventsEndRef.current.scrollIntoView({ behavior: 'instant' });
  }, [events, userId]);

  const shouldShowDate = (currIndex: number) => {
    if (currIndex === 0) return true;
    return !isSameDay(
      new Date(events[currIndex].createdAt),
      new Date(events[currIndex - 1].createdAt),
    );
  };

  const shouldShowAlias = (currIndex: number) => {
    const current = events[currIndex];
    if (current.type !== EVENT_TYPE.MESSAGE) return false;

    if (currIndex === 0) return true;

    const prev = events[currIndex - 1];

    const currentDate = new Date(current.createdAt);
    const prevDate = new Date(prev.createdAt);
    if (!isSameDay(currentDate, prevDate)) return true;

    if (prev.type !== EVENT_TYPE.MESSAGE) return true;

    return prev.user.userId !== current.user.userId;
  };

  return (
    <div
      className="flex flex-col flex-grow min-h-0 overflow-y-auto relative px-2 whitespace-pre-wrap gap-2"
      style={{ overflowWrap: 'anywhere' }}
    >
      {events.map((evt, index) => (
        <div key={index} className="flex flex-col">
          {shouldShowDate(index) && <DateMarker date={evt.createdAt} />}

          {evt.type === EVENT_TYPE.ROOM_CREATED && (
            <SystemEvent
              text={`${evt.user.alias ?? evt.user.userId} created the room`}
              className="bg-blue-100"
            />
          )}

          {evt.type === EVENT_TYPE.USER_JOINED && (
            <SystemEvent
              text={`${evt.user.alias ?? evt.user.userId} joined the room`}
              className="bg-emerald-100"
            />
          )}

          {evt.type === EVENT_TYPE.USER_LEFT && (
            <SystemEvent
              text={`${evt.user.alias ?? evt.user.userId} left the room`}
              className="bg-rose-100"
            />
          )}

          {evt.type === EVENT_TYPE.MESSAGE && (
            <Message event={evt} shouldShowAlias={shouldShowAlias(index)} />
          )}
        </div>
      ))}

      <div ref={eventsEndRef} />
    </div>
  );
}
