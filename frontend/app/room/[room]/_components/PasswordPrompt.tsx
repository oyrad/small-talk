import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { useRoomDetailsQuery } from '@/hooks/room/use-room-details-query';

interface PasswordPromptProps {
  onPasswordSubmit: ({ password }: { password: string }) => void;
}

export function PasswordPrompt({ onPasswordSubmit }: PasswordPromptProps) {
  const { room: roomId } = useParams<{ room: string }>();
  const { data: room } = useRoomDetailsQuery(roomId);

  const { register, handleSubmit, watch } = useForm<{ password: string }>();
  const password = watch('password');

  return (
    <div className="h-full bg-white p-4 flex justify-center items-center">
      <Card className="px-4 py-3 gap-3 w-full">
        {room && room.name ? (
          <div>
            <h1 className="text-lg font-semibold">{room.name}</h1>
            <p className="text-xs text-gray-500">{room.id}</p>
          </div>
        ) : (
          <h1 className="text-sm font-semibold cursor-pointer justify-self-start w-fit">{room?.id}</h1>
        )}

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="flex gap-2">
          <Input {...register('password')} type="password" placeholder="Enter room password" />
          <Button type="submit" disabled={!password}>
            Join
          </Button>
        </form>
      </Card>
    </div>
  );
}
