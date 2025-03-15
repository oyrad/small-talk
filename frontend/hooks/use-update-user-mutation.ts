import { User } from '@/types/user';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

interface UpdateUserParams {
  userId: string;
  data: Partial<User>;
}

async function updateUser({ userId, data }: UpdateUserParams): Promise<User> {
  console.log({ userId, data });
  const res = await fetch(`http://localhost:5542/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export function useUpdateUserMutation(options?: Omit<UseMutationOptions<User, Error, UpdateUserParams>, 'mutationFn'>) {
  return useMutation({
    mutationFn: updateUser,
    ...options,
  });
}
