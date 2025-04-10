import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useCreateRoomMutation } from '@/hooks/room/use-create-room-mutation';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/use-user-store';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/ui/components/dialog';
import { ClipLoader } from 'react-spinners';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISAPPEARING_MESSAGES, DisappearingMessages } from '@/types/disappearing-messages';

interface CreateRoomFormValues {
  name: string;
  password: string;
  disappearingMessages: DisappearingMessages;
}

interface CreateRoomProps extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function CreateRoom({ isOpen, setIsOpen, children }: CreateRoomProps) {
  const { userId } = useUserStore();
  const { push } = useRouter();

  const { register, control, handleSubmit } = useForm<CreateRoomFormValues>({
    defaultValues: {
      name: '',
      password: '',
      disappearingMessages: DISAPPEARING_MESSAGES.DISABLED,
    },
  });

  const { mutate: createRoom, isPending } = useCreateRoomMutation({
    onSuccess: (data) => {
      push(`/room/${data.id}`);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <form
          onSubmit={handleSubmit((values) =>
            createRoom({
              ...values,
              disappearingMessages:
                values.disappearingMessages === DISAPPEARING_MESSAGES.DISABLED ? null : values.disappearingMessages,
              userId: userId ?? '',
            }),
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-left mb-2">New room</DialogTitle>
            <DialogBody className="flex flex-col gap-2 w-full">
              <Input {...register('name')} placeholder="Name" />
              <Input {...register('password')} type="password" placeholder="Password" />

              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm gap-2">Disappearing messages</p>

                <Controller
                  name="disappearingMessages"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={DISAPPEARING_MESSAGES.DISABLED}>Disabled</SelectItem>
                          <SelectItem value={DISAPPEARING_MESSAGES.TEN_MINUTES}>10 minutes</SelectItem>
                          <SelectItem value={DISAPPEARING_MESSAGES.THIRTY_MINUTES}>30 minutes</SelectItem>
                          <SelectItem value={DISAPPEARING_MESSAGES.ONE_HOUR}>1 hour</SelectItem>
                          <SelectItem value={DISAPPEARING_MESSAGES.ONE_DAY}>1 day</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <Button className="w-full">{isPending ? <ClipLoader color="white" size={20} /> : 'Create'}</Button>
            </DialogBody>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
