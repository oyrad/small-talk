import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';

export interface RoomUser {
  id: string;
  isAdmin: boolean;
  joinedAt: string;
  userId: string;
  alias: string;
}

export interface Room {
  id: string;
  name: string | null;
  hasPassword: boolean;
  users: Array<RoomUser>;
  disappearingMessages: boolean;
  createdAt: string;
}

async function getRoomDetails(roomId: string): Promise<Room> {
  const response = await fetchWithCredentials(`room/${roomId}/details`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export function useRoomDetailsQuery(
  roomId: string,
  options?: Omit<UseQueryOptions<Room, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['room-details', roomId],
    queryFn: () => getRoomDetails(roomId),
    enabled: !!roomId,
    ...options,
  });
}
