import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

interface JoinRoomResponse {
  success: boolean;
}

interface JoinRoomParams {
  roomId: string;
  userId: string;
  password?: string;
}

async function joinRoom({ roomId, userId, password }: JoinRoomParams): Promise<JoinRoomResponse> {
  const res = await fetchWithPrefix(`room/${roomId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  if (!res.ok) {
    throw new Error('Failed to join room');
  }

  return res.json();
}

export function useJoinRoomMutation(
  options?: Omit<UseMutationOptions<JoinRoomResponse, unknown, JoinRoomParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinRoom,
    onSuccess: (...args) => {
      console.log({ args });
      options?.onSuccess?.(...args);

      if (args[0].success) {
        return queryClient.invalidateQueries({ queryKey: ['room-details', args[1].roomId] });
      }
    },
    ...options,
  });
}
