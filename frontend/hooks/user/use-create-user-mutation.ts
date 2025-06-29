import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { User } from '@/hooks/user/use-get-user-by-id-query';

async function createUser(): Promise<User> {
  const res = await fetchWithCredentials('user', {
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
