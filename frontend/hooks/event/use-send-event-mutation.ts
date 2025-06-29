import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { EventType } from '@/types/event-type';
import { Event } from '@/hooks/room/use-room-events-query';

interface SendEventParams {
  type: EventType;
  roomId: string;
  content?: string;
}

async function sendEvent({ type, roomId, content }: SendEventParams): Promise<Event> {
  const res = await fetchWithCredentials(`event/${roomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, content }),
  });

  if (!res.ok) {
    throw new Error('Failed to send event');
  }

  return res.json();
}

export function useSendEventMutation(options?: UseMutationOptions<Event, Error, SendEventParams>) {
  return useMutation({
    mutationFn: sendEvent,
    ...options,
  });
}
