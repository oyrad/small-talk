import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from '@/utils/fetch-with-credentials';
import { DisappearingMessages } from '@/types/disappearing-messages';

export interface User {
  id: string;
  alias: string | null;
  rooms: Array<{
    id: string;
    name: string;
    disappearingMessages: DisappearingMessages | null;
    createdAt: string;
    joinedAt: string;
    isAdmin: boolean;
  }>;
  createdAt: string;
}

async function getUserById(userId: string): Promise<User> {
  const response = await fetchWithCredentials(`user/${userId}`);

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
