import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Room } from '@/types/room';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';

async function getRoomById(roomId: string): Promise<Room> {
  const response = await fetchWithPrefix(`room/${roomId}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export function useGetRoomByIdQuery(
  roomId: string,
  options?: Omit<UseQueryOptions<Room, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
    ...options,
  });
}
