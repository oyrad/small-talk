import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';

import { EventType } from '@/types/event-type';
import { RoomUser } from '@/hooks/room/use-room-details-query';

export interface Event {
  id: string;
  type: EventType;
  content: string;
  createdAt: string;
  user: RoomUser;
}

async function getRoomEvents(roomId: string): Promise<Array<Event>> {
  const response = await fetchWithCredentials(`room/${roomId}/events`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export function useRoomEventsQuery(
  roomId: string,
  options?: Omit<UseQueryOptions<Array<Event>, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['room-events', roomId],
    queryFn: () => getRoomEvents(roomId),
    ...options,
  });
}
