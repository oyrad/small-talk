import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/ui/components/dialog';
import { Room } from '@/hooks/room/use-room-details-query';

interface RoomMembersProps extends PropsWithChildren {
  members: Room['users'];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function RoomMembers({ members, isOpen, setIsOpen, children }: RoomMembersProps) {
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
                    {member.userId}
                  </p>
                );
              } else {
                return (
                  <div key={member.id} className="flex flex-col items-start">
                    <p className="font-semibold text-sm">{member.alias}</p>
                    <p className="text-xs text-gray-500">{member.userId}</p>
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
