import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { User } from '@/types/user';

async function createUser(): Promise<User> {
  const res = await fetch('http://localhost:5542/user', {
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
