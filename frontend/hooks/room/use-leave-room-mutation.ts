import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

interface LeaveRoomParams {
  roomId: string;
  userId: string;
}

async function leaveRoom({ roomId, userId }: LeaveRoomParams) {
  const res = await fetchWithPrefix(`room/${roomId}/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error('Failed to leave room');
  }

  return res.json();
}

export function useLeaveRoomMutation(
  options?: Omit<UseMutationOptions<ReturnType<typeof leaveRoom>, unknown, LeaveRoomParams>, 'mutationFn'>,
) {
  return useMutation({
    mutationFn: leaveRoom,
    ...options,
  });
}
