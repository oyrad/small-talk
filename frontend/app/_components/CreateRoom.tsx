import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateRoomMutation } from '@/hooks/use-create-room-mutation';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/use-user-store';

interface CreateRoomFormValues {
  name: string;
  password: string;
}

interface CreateRoomProps extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function CreateRoom({ isOpen, setIsOpen, children }: CreateRoomProps) {
  const { userId } = useUserStore();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <form onSubmit={handleSubmit((values) => createRoom({ ...values, userId: userId ?? '' }))}>
          <DialogHeader>
            <DialogTitle className="text-left mb-2">Create room</DialogTitle>
            <DialogDescription className="flex flex-col gap-1 w-full">
              <Input {...register('name')} placeholder="Room name" />
              <Input {...register('password')} type="password" placeholder="Password" className="mb-2" />
              <Button className="w-full">Create new room</Button>
            </DialogDescription>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
