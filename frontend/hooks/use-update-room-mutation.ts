import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { Room } from '@/types/room';

interface UpdateRoomParams {
  id: string;
  data: Partial<Room>;
}

async function updateRoom({ id, data }: UpdateRoomParams): Promise<Room> {
  const res = await fetchWithPrefix(`room/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export function useUpdateRoomMutation(options?: Omit<UseMutationOptions<Room, Error, UpdateRoomParams>, 'mutationFn'>) {
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
