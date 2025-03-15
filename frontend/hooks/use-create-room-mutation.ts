import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Room } from '@/types/room';

interface CreateRoomParams {
  name: string;
  password: string;
  userId: string;
}

async function createRoom({ name, password, userId }: CreateRoomParams): Promise<Room> {
  const res = await fetch('http://localhost:5542/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password, userId }),
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
