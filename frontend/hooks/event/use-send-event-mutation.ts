import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { EventType } from '@/types/event-type';
import { Event } from '@/types/event';

interface SendEventParams {
  type: EventType;
  roomId: string;
  userId: string;
  content?: string;
}

async function sendEvent({ type, roomId, userId, content }: SendEventParams): Promise<Event> {
  const res = await fetchWithPrefix(`event/${roomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, userId, content }),
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
