import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { RoomUser } from '@/hooks/room/use-room-details-query';

interface UpdateUserParams {
  roomId: string;
  userId: string;
  data: Partial<RoomUser>;
}

async function updateRoomUser({ roomId, userId, data }: UpdateUserParams): Promise<RoomUser> {
  const res = await fetchWithCredentials(`room/${roomId}/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export function useUpdateRoomUserMutation(
  options?: Omit<UseMutationOptions<RoomUser, Error, UpdateUserParams>, 'mutationFn'>,
) {
  return useMutation({
    mutationFn: updateRoomUser,
    ...options,
  });
}
