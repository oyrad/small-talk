import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Room } from '@/types/room';

async function getRoomById(id: string): Promise<Room> {
  const response = await fetch(`http://localhost:5542/room/${id}`);
  return response.json();
}

export function useGetRoomByIdQuery(id: string, options?: Omit<UseQueryOptions<Room, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoomById(id),
    ...options,
  });
}
