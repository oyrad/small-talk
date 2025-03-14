'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/use-user-store';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';
import { useCreateRoomMutation } from '@/hooks/use-create-room-mutation';

interface CreateRoomFormValues {
  name: string;
  password: string;
}

export default function Home() {
  const { userId, userAlias } = useUserStore();
  const { push } = useRouter();

  const { register, handleSubmit } = useForm<CreateRoomFormValues>({
    defaultValues: {
      name: '',
      password: '',
    },
  });

  const { mutate: createRoom } = useCreateRoomMutation({
    onSuccess: (data) => {
      push(`/room/${data.id}`);
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-full p-6 gap-3">
      <Card className="w-full py-2.5 px-4 gap-0.5 text-xs">
        <p className="text-lg font-semibold">{userAlias}</p>
        <p className="mb-2">User id: {userId}</p>
        <ChangeUserAlias>
          <Button className="w-full" variant="outline">
            Change alias
          </Button>
        </ChangeUserAlias>
      </Card>
      <form onSubmit={handleSubmit((values) => createRoom(values))} className="w-full">
        <Card className="p-4 gap-2">
          <Input {...register('name')} placeholder="Room name" />
          <Input {...register('password')} placeholder="Password" className="mb-2" />
          <Button>Create new room</Button>
        </Card>
      </form>
    </div>
  );
}
