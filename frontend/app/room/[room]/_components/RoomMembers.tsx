import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';
import { Room } from '@/types/room';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/ui/components/dialog';

interface RoomMembersProps extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  members: Room['users'];
}

export function RoomMembers({ isOpen, setIsOpen, members, children }: RoomMembersProps) {
  console.log({ members });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left mb-2">Members</DialogTitle>
          <DialogBody className="flex flex-col gap-3 max-h-96 overflow-y-scroll">
            {members.map((member) => {
              if (!member.alias) {
                return (
                  <p key={member.id} className="font-semibold text-sm text-start">
                    {member.id}
                  </p>
                );
              } else {
                return (
                  <div key={member.id} className="flex flex-col items-start">
                    <p className="font-semibold text-sm">{member.alias}</p>
                    <p className="text-xs">{member.id}</p>
                  </div>
                );
              }
            })}
          </DialogBody>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
