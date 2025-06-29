import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { User } from '@/hooks/user/use-get-user-by-id-query';

interface UpdateUserParams {
  userId: string;
  data: Partial<User>;
}

async function updateUser({ userId, data }: UpdateUserParams): Promise<User> {
  const res = await fetchWithCredentials(`user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export function useUpdateUserMutation(
  options?: Omit<UseMutationOptions<User, Error, UpdateUserParams>, 'mutationFn'>,
) {
  return useMutation({
    mutationFn: updateUser,
    ...options,
  });
}
