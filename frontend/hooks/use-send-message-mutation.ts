import { fetchWithPrefix } from '@/utils/fetch-with-prefix';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/types/message';

interface SendMessageParams {
  roomId: string;
  userId: string;
  content: string;
}

async function sendMessage({ roomId, userId, content }: SendMessageParams): Promise<Message> {
  const res = await fetchWithPrefix(`message/${roomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, content }),
  });

  if (!res.ok) {
    throw new Error('Failed to send message');
  }

  return res.json();
}

export function useSendMessageMutation(options?: UseMutationOptions<Message, Error, SendMessageParams>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);

      return queryClient.invalidateQueries({ queryKey: ['messages', args[1].roomId] });
    },
    ...options,
  });
}
