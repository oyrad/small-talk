import { useParams } from 'next/navigation';
import { useGetRoomByIdQuery } from '@/hooks/use-get-room-by-id-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/use-user-store';
import { useJoinRoomMutation } from '@/hooks/use-join-room-mutation';

interface PasswordPromptFormValues {
  password: string;
}

export function PasswordPrompt() {
  const { room: roomId } = useParams<{ room: string }>();
  const { data: room } = useGetRoomByIdQuery(roomId);

  const { userId } = useUserStore();

  const { mutateAsync: joinRoom } = useJoinRoomMutation();

  const { register, handleSubmit, watch } = useForm<PasswordPromptFormValues>();
  const password = watch('password');

  async function onSubmit({ password }: PasswordPromptFormValues) {
    const res = await joinRoom({ roomId, userId: userId ?? '', password });

    if (!res.success) {
      toast.error('Invalid password');
    }
  }

  return (
    <div className="h-full bg-white p-4 flex justify-center items-center">
      <Card className="p-3 gap-3 w-full">
        {room && room.name ? (
          <div>
            <h1 className="text-lg font-semibold">{room.name}</h1>
            <p className="text-xs text-gray-500">{room.id}</p>
          </div>
        ) : (
          <h1 className="text-sm font-semibold cursor-pointer justify-self-start w-fit">{room?.id}</h1>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <Input {...register('password')} type="password" placeholder="Enter room password" />
          <Button type="submit" disabled={!password}>
            Join
          </Button>
        </form>
      </Card>
    </div>
  );
}
