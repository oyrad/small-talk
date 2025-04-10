import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { DisappearingMessages } from '@/types/disappearing-messages';
import { Room } from '@/hooks/room/use-room-details-query';

interface CreateRoomParams {
  name: string;
  password: string;
  userId: string;
  disappearingMessages: DisappearingMessages | null;
}

async function createRoom({ userId, ...values }: CreateRoomParams): Promise<Room> {
  const res = await fetchWithPrefix('room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, ...values }),
  });

  if (!res.ok) {
    throw new Error('Failed to create room');
  }

  return res.json();
}

export function useCreateRoomMutation(
  options?: Omit<UseMutationOptions<Room, unknown, CreateRoomParams>, 'mutationFn'>,
) {
  return useMutation({
    mutationFn: createRoom,
    ...options,
  });
}
