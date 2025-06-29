import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Copy, DoorOpen, Settings, SquarePen, UserRoundPen, Users } from 'lucide-react';
import { ChangeRoomName } from '@/app/room/[room]/_components/ChangeRoomName';
import { Button } from '@/components/ui/button';
import { RoomMembers } from '@/app/room/[room]/_components/RoomMembers';
import { useLeaveRoomMutation } from '@/hooks/room/use-leave-room-mutation';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/use-user-store';
import { socket } from '@/socket/socket';
import { EVENT_TYPE } from '@/types/event-type';
import { Room } from '@/hooks/room/use-room-details-query';
import { CHANGE_ALIAS_FORM_LOCATION } from '@/types/change-user-alias-location';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';

interface HeaderDropDownMenuProps {
  onCopyLink: VoidFunction;
  room: Room;
}

export function RoomSettings({ onCopyLink, room }: HeaderDropDownMenuProps) {
  const { userId } = useUserStore();

  const [isAliasDialogOpen, setIsAliasDialogOpen] = useState(false);
  const [isRoomNameDialogOpen, setIsRoomNameDialogOpen] = useState(false);
  const [isRoomMembersDialogOpen, setIsRoomMembersDialogOpen] = useState(false);

  const isUserAdmin = room.users.find((user) => user.userId === userId)?.isAdmin;

  const { push } = useRouter();

  const { mutate: leaveRoom } = useLeaveRoomMutation({
    onSuccess: () => {
      push('/');
      socket.emit('event', {
        type: EVENT_TYPE.USER_LEFT,
        roomId: room.id,
        userId: userId ?? '',
      });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button asChild variant="outline" className="h-full p-0">
            <Settings className="size-10 p-2 text-slate-700" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4">
          <DropdownMenuItem onClick={() => setIsRoomMembersDialogOpen(true)}>
            <Users />
            Members
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsAliasDialogOpen(true)}>
            <UserRoundPen />
            Change user alias
          </DropdownMenuItem>

          {isUserAdmin && (
            <DropdownMenuItem onClick={() => setIsRoomNameDialogOpen(true)}>
              <SquarePen />
              Change room name
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={onCopyLink}>
            <Copy />
            Copy room link
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-600" onClick={() => leaveRoom({ roomId: room.id })}>
            <DoorOpen className="text-red-600" />
            Leave room
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeUserAlias
        location={CHANGE_ALIAS_FORM_LOCATION.ROOM}
        userId={userId ?? ''}
        roomId={room.id}
        isOpen={isAliasDialogOpen}
        setIsOpen={setIsAliasDialogOpen}
      />
      <ChangeRoomName
        roomId={room.id}
        isOpen={isRoomNameDialogOpen}
        setIsOpen={setIsRoomNameDialogOpen}
      />
      <RoomMembers
        members={room.users}
        isOpen={isRoomMembersDialogOpen}
        setIsOpen={setIsRoomMembersDialogOpen}
      />
    </>
  );
}
