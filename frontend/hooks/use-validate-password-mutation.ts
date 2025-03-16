import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { fetchWithPrefix } from '@/utils/fetch-with-prefix';

interface ValidatePasswordResponse {
  success: boolean;
}

async function validatePassword(roomId: string, userId: string, password: string): Promise<ValidatePasswordResponse> {
  const res = await fetchWithPrefix(`room/${roomId}/validate-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  if (!res.ok) {
    throw new Error('Failed to validate password');
  }

  return res.json();
}

interface UseValidatePasswordMutationFnParams {
  userId: string;
  password: string;
}

export function useValidatePasswordMutation(
  roomId: string,
  options?: UseMutationOptions<ValidatePasswordResponse, unknown, UseValidatePasswordMutationFnParams>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, password }) => validatePassword(roomId, userId, password),
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);

      if (args[0].success) {
        return queryClient.invalidateQueries({ queryKey: ['room', roomId] });
      }
    },
    ...options,
  });
}
