import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { User } from '@/types/user';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';

async function getUserById(userId: string): Promise<User> {
  const response = await fetchWithPrefix(`user/${userId}`);

  if (!response.ok) {
    throw new Error('User not found');
  }

  return response.json();
}

export function useGetUserByIdQuery(
  userId: string,
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    ...options,
  });
}
