import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useCreateRoomMutation } from '@/hooks/use-create-room-mutation';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/use-user-store';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/ui/components/dialog';
import { ClipLoader } from 'react-spinners';

interface CreateRoomFormValues {
  name: string;
  password: string;
  disappearingMessages: boolean;
}

interface CreateRoomProps extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function CreateRoom({ isOpen, setIsOpen, children }: CreateRoomProps) {
  const { userId } = useUserStore();
  const { push } = useRouter();

  const { register, control, handleSubmit, watch } = useForm<CreateRoomFormValues>({
    defaultValues: {
      name: '',
      password: '',
      disappearingMessages: false,
    },
  });

  const disappearingMessages = watch('disappearingMessages');

  const { mutate: createRoom, isPending } = useCreateRoomMutation({
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
            <DialogTitle className="text-left mb-2">New room</DialogTitle>
            <DialogBody className="flex flex-col gap-1.5 w-full">
              <Input {...register('name')} placeholder="Name" />
              <Input {...register('password')} type="password" placeholder="Password" className="mb-2" />
              <div className="flex flex-col gap-1 mb-2">
                <Controller
                  name="disappearingMessages"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 text-sm">
                      <Checkbox
                        id="disappearing-messages"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      <label htmlFor="disappearing-messages">Disappearing messages</label>
                    </div>
                  )}
                />

                {disappearingMessages && (
                  <p className="text-xs text-gray-500 text-left">Messages will be deleted 30 minutes after sending.</p>
                )}
              </div>

              <Button className="w-full">{isPending ? <ClipLoader color="white" size={20} /> : 'Create'}</Button>
            </DialogBody>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
