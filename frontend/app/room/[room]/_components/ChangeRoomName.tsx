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
import { useUpdateRoomMutation } from '@/hooks/use-update-room-mutation';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

interface ChangeRoomNameFormValues {
  name: string;
}

interface ChangeRoomNameProps extends PropsWithChildren {
  roomId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ChangeRoomName({ roomId, isOpen, setIsOpen, children }: ChangeRoomNameProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<ChangeRoomNameFormValues>();

  const { mutate: updateRoom } = useUpdateRoomMutation({
    onSuccess: async () => {
      setIsOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <form onSubmit={handleSubmit(({ name }) => updateRoom({ id: roomId, data: { name } }))}>
          <DialogHeader>
            <DialogTitle className="text-left mb-2">Change room name</DialogTitle>
            <DialogDescription className="flex gap-2">
              <Input {...register('name')} placeholder="Name" />
              <Button>Save</Button>
            </DialogDescription>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
