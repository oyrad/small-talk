import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { Room } from '@/hooks/room/use-room-details-query';

interface UpdateRoomParams {
  id: string;
  data: Partial<Room>;
}

async function updateRoom({ id, data }: UpdateRoomParams): Promise<Room> {
  const res = await fetchWithCredentials(`room/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export function useUpdateRoomMutation(
  options?: Omit<UseMutationOptions<Room, Error, UpdateRoomParams>, 'mutationFn'>,
) {
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
