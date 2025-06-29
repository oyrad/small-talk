import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

interface LeaveRoomParams {
  roomId: string;
}

async function leaveRoom({ roomId }: LeaveRoomParams) {
  const res = await fetchWithCredentials(`room/${roomId}/leave`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to leave room');
  }

  return res.json();
}

export function useLeaveRoomMutation(
  options?: Omit<
    UseMutationOptions<ReturnType<typeof leaveRoom>, unknown, LeaveRoomParams>,
    'mutationFn'
  >,
) {
  return useMutation({
    mutationFn: leaveRoom,
    ...options,
  });
}
