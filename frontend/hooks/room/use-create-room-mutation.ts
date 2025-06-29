import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { DisappearingMessages } from '@/types/disappearing-messages';
import { Room } from '@/hooks/room/use-room-details-query';

interface CreateRoomParams {
  name: string;
  password: string;
  disappearingMessages: DisappearingMessages | null;
}

async function createRoom(values: CreateRoomParams): Promise<Room> {
  const res = await fetchWithCredentials('room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
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
