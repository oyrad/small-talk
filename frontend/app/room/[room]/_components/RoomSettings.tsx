import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Copy, Settings, SquarePen, UserRoundPen, Users } from 'lucide-react';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';
import { ChangeRoomName } from '@/app/room/[room]/_components/ChangeRoomName';
import { Button } from '@/components/ui/button';
import { Room } from '@/types/room';
import { RoomMembers } from '@/app/room/[room]/_components/RoomMembers';

interface HeaderDropDownMenuProps {
  onCopyLink: VoidFunction;
  userId: string;
  room: Room;
}

export function RoomSettings({ onCopyLink, userId, room }: HeaderDropDownMenuProps) {
  const [isAliasDialogOpen, setIsAliasDialogOpen] = useState(false);
  const [isRoomNameDialogOpen, setIsRoomNameDialogOpen] = useState(false);
  const [isRoomMembersDialogOpen, setIsRoomMembersDialogOpen] = useState(false);

  const isUserRoomCreator = userId === room.creator.id;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button asChild variant="outline" className="h-full p-0">
            <Settings className="size-10 p-2" />
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

          {isUserRoomCreator && (
            <DropdownMenuItem onClick={() => setIsRoomNameDialogOpen(true)}>
              <SquarePen />
              Change room name
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={onCopyLink}>
            <Copy />
            Copy room link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeUserAlias userId={userId} roomId={room.id} isOpen={isAliasDialogOpen} setIsOpen={setIsAliasDialogOpen} />
      <ChangeRoomName roomId={room.id} isOpen={isRoomNameDialogOpen} setIsOpen={setIsRoomNameDialogOpen} />
      <RoomMembers isOpen={isRoomMembersDialogOpen} setIsOpen={setIsRoomMembersDialogOpen} members={room.users} />
    </>
  );
}
