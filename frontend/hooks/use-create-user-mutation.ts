import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { User } from '@/types/user';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';

async function createUser(): Promise<User> {
  const res = await fetchWithPrefix('user', {
    method: 'POST',
  });

  return res.json();
}

export function useCreateUserMutation(options?: UseMutationOptions<User, Error>) {
  return useMutation({
    mutationFn: createUser,
    ...options,
  });
}
