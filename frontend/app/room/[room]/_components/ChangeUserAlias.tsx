import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/stores/use-user-store';
import { PropsWithChildren } from 'react';
import { useUpdateUserMutation } from '@/hooks/user/use-update-user-mutation';
import { useQueryClient } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { CHANGE_ALIAS_FORM_LOCATION, ChangeAliasFormLocation } from '@/types/change-user-alias-location';
import { useUpdateRoomUserMutation } from '@/hooks/room-user/use-update-room-user-mutation';

interface ChangeUserAliasFormValues {
  alias: string;
}

interface ChangeUserAliasProps extends PropsWithChildren {
  location: ChangeAliasFormLocation;
  userId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  roomId?: string;
}

export function ChangeUserAlias({ location, userId, isOpen, setIsOpen, children, roomId }: ChangeUserAliasProps) {
  const { setUserAlias } = useUserStore();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<ChangeUserAliasFormValues>({
    defaultValues: {
      alias: '',
    },
  });

  const { mutate: updateUser } = useUpdateUserMutation({
    onSuccess: async (data) => {
      setUserAlias(data.alias ?? '');
      setIsOpen(false);
    },
  });

  const { mutate: updateRoomUser } = useUpdateRoomUserMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['room-details', roomId] });
      await queryClient.invalidateQueries({ queryKey: ['room-events', roomId] });

      setIsOpen(false);
    },
  });

  function onSubmit(values: ChangeUserAliasFormValues) {
    if (location === CHANGE_ALIAS_FORM_LOCATION.HOME) {
      updateUser({ userId, data: values });
    }

    if (location === CHANGE_ALIAS_FORM_LOCATION.ROOM) {
      updateRoomUser({ userId, roomId: roomId ?? '', data: values });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-left mb-2">Change user alias</DialogTitle>
            <div className="flex flex-col gap-3">
              <div className="text-xs flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <Info className="size-5 min-w-5 text-gray-600" />
                <p className="text-gray-800">
                  {location === CHANGE_ALIAS_FORM_LOCATION.HOME
                    ? 'This will be your default alias in new rooms.'
                    : 'This alias applies only for the current room.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Input {...register('alias')} placeholder="Alias" />
                <Button>Save</Button>
              </div>
            </div>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
