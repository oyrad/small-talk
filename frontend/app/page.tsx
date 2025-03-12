'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';

interface CreateRoomFormValues {
  name: string;
  password: string;
}

export default function Home() {
  const { push } = useRouter();

  const { register, handleSubmit } = useForm<CreateRoomFormValues>({
    defaultValues: {
      name: '',
      password: '',
    },
  });

  function onSubmit(values: CreateRoomFormValues) {
    console.log(values);
    const id = v4();
    push(`/room/${id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center h-full">
      <Card className="w-96 p-4 gap-4">
        <Input {...register('name')} placeholder="Room name" />
        <Input {...register('password')} placeholder="Password" />
        <Button>Create new room</Button>
      </Card>
    </form>
  );
}
