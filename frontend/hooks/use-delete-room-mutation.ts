import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';

async function deleteRoom(id: string) {
  await fetchWithPrefix(`room/${id}`, {
    method: 'DELETE',
  });
}

export function useDeleteRoomMutation(options?: UseMutationOptions<unknown, unknown, string>) {
  return useMutation({
    mutationFn: deleteRoom,
    ...options,
  });
}
