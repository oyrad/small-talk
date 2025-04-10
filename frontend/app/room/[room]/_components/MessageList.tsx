import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/use-user-store';
import { useEffect, useRef } from 'react';
import { getMessageTime } from '@/utils/get-message-time';
import { isSameDay } from 'date-fns';
import Linkify from 'linkify-react';
import { EVENT_TYPE } from '@/types/event-type';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/hooks/room/use-room-events-query';

function MessageTimestamp({ timestamp }: { timestamp: string }) {
  return <p className="text-gray-400 text-[0.70rem] whitespace-nowrap">{getMessageTime(timestamp)}</p>;
}

function DateMarker({ date, className = '' }: { date: string; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('mx-auto px-3 py-0.5 rounded-lg w-fit', className)}>
      {new Date(date).toLocaleDateString()}
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

  return (
    <div
      className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-2 relative px-2 whitespace-pre-wrap"
      style={{
        overflowWrap: 'anywhere',
      }}
    >
      {events.map((evt, index) => (
        <div key={index} className="flex flex-col">
          {index === 0 && <DateMarker date={evt.createdAt} className="mb-2" />}

          {index !== 0 && !isSameDay(new Date(evt?.createdAt), new Date(events[index - 1].createdAt)) && (
            <DateMarker date={evt.createdAt} className="mb-2" />
          )}

          {evt.type === EVENT_TYPE.ROOM_CREATED && (
            <p className="mx-auto my-0.5 bg-blue-100 text-center text-xs px-2.5 py-0.5 rounded-xl">
              {evt.user.alias ?? evt.user.id} created the room
            </p>
          )}

          {evt.type === EVENT_TYPE.USER_JOINED && (
            <p className="mx-auto my-0.5 bg-emerald-100 text-center text-xs px-2.5 py-0.5 rounded-xl">
              {evt.user.alias ?? evt.user.id} joined the room
            </p>
          )}

          {evt.type === EVENT_TYPE.USER_LEFT && (
            <p className="mx-auto my-0.5 bg-rose-100 text-center text-xs px-2.5 py-0.5 rounded-xl">
              {evt.user.alias ?? evt.user.id} left the room
            </p>
          )}

          {evt.type === EVENT_TYPE.MESSAGE && (
            <>
              {evt.user.userId !== events[index - 1]?.user.userId && (
                <p className={cn('text-gray-700 text-xs mb-1', evt.user.userId === userId && 'text-right')}>
                  {evt.user.alias ?? evt.user.userId}
                </p>
              )}

              <div
                className={cn(
                  'flex gap-1 text-sm items-end',
                  evt.user.userId === userId && 'ml-auto flex-row-reverse',
                  evt.user.id === events[index - 1]?.user.id && '-mt-1',
                )}
              >
                <p
                  key={index}
                  className={cn(
                    'px-3 py-1 rounded-xl bg-gray-200 text-black hyphens-auto',
                    evt.user.userId === userId && 'bg-gray-700 text-white',
                  )}
                >
                  <Linkify
                    options={{
                      className: evt.user.userId === userId ? 'text-blue-300 underline' : 'text-blue-700 underline',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }}
                  >
                    {evt.content}
                  </Linkify>
                </p>

                <MessageTimestamp timestamp={evt.createdAt} />
              </div>
            </>
          )}
        </div>
      ))}

      <div ref={eventsEndRef} />
    </div>
  );
}
