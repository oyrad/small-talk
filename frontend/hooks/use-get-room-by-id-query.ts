import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Room } from '@/types/room';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';

async function getRoomById(id: string): Promise<Room> {
  const response = await fetchWithPrefix(`room/${id}`);
  return response.json();
}

export function useGetRoomByIdQuery(id: string, options?: Omit<UseQueryOptions<Room, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoomById(id),
    ...options,
  });
}
