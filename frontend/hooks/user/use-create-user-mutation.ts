import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { User } from '@/hooks/user/use-get-user-by-id-query';

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
