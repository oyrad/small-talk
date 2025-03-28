import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

interface JoinRoomParams {
  roomId: string;
  userId: string;
}

async function joinRoom({ roomId, userId }: JoinRoomParams) {
  const res = await fetchWithPrefix(`room/${roomId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error('Failed to join room');
  }

  return res.json();
}

export function useJoinRoomMutation(
  options?: Omit<UseMutationOptions<ReturnType<typeof joinRoom>, unknown, JoinRoomParams>, 'mutationFn'>,
) {
  return useMutation({
    mutationFn: joinRoom,
    ...options,
  });
}
