import { useMutation, UseMutationOptions } from '@tanstack/react-query';

async function deleteRoom(id: string) {
  await fetch(`http://localhost:5542/room/${id}`, {
    method: 'DELETE',
  });
}

export function useDeleteRoomMutation(options?: UseMutationOptions<unknown, unknown, string>) {
  return useMutation({
    mutationFn: deleteRoom,
    ...options,
  });
}
