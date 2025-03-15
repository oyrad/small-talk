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
import { PropsWithChildren, useState } from 'react';
import { useUpdateUserMutation } from '@/hooks/use-update-user-mutation';

interface ChangeUserAliasFormValues {
  alias: string;
}

interface ChangeUserAliasProps extends PropsWithChildren {
  userId: string;
}

export function ChangeUserAlias({ userId, children }: ChangeUserAliasProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setUserAlias } = useUserStore();

  const { register, handleSubmit } = useForm<ChangeUserAliasFormValues>({
    defaultValues: {
      alias: '',
    },
  });

  const { mutateAsync: updateUser } = useUpdateUserMutation({
    onSuccess: (data) => {
      setUserAlias(data.alias);
    },
  });

  async function onSubmit({ alias }: ChangeUserAliasFormValues) {
    await updateUser({ userId, data: { alias } });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
