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
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/stores/use-user-store';
import { PropsWithChildren } from 'react';
import { useUpdateUserMutation } from '@/hooks/use-update-user-mutation';

interface ChangeUserAliasFormValues {
  alias: string;
}

interface ChangeUserAliasProps extends PropsWithChildren {
  userId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ChangeUserAlias({ userId, isOpen, setIsOpen, children }: ChangeUserAliasProps) {
  const { setUserAlias } = useUserStore();

  const { register, handleSubmit } = useForm<ChangeUserAliasFormValues>({
    defaultValues: {
      alias: '',
    },
  });

  const { mutate: updateUser } = useUpdateUserMutation({
    onSuccess: (data) => {
      setUserAlias(data.alias);
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <form onSubmit={handleSubmit(({ alias }) => updateUser({ userId, data: { alias } }))}>
          <DialogHeader>
            <DialogTitle className="text-left mb-2">Change user alias</DialogTitle>
            <DialogDescription className="flex gap-2">
              <Input {...register('alias')} placeholder="New user alias" />
              <Button>Save</Button>
            </DialogDescription>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
