import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Copy, Settings, SquarePen, UserRoundPen } from 'lucide-react';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';
import { ChangeRoomName } from '@/app/room/[room]/_components/ChangeRoomName';
import { Button } from '@/components/ui/button';
import { SocketConnectionIndicator } from '@/app/room/[room]/_components/SocketConnectionIndicator';

interface HeaderDropDownMenuProps {
  onCopyLink: VoidFunction;
  userId: string;
  roomCreatorId: string;
  roomId: string;
}

export function RoomSettings({ onCopyLink, userId, roomCreatorId, roomId }: HeaderDropDownMenuProps) {
  const [isAliasDialogOpen, setIsAliasDialogOpen] = useState(false);
  const [isRoomNameDialogOpen, setIsRoomNameDialogOpen] = useState(false);

  const isUserRoomCreator = userId === roomCreatorId;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button asChild variant="outline" className="h-full p-0">
            <Settings className="size-10 p-2" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={onCopyLink}>
            <Copy />
            Copy room link
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

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <SocketConnectionIndicator />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeUserAlias userId={userId} roomId={roomId} isOpen={isAliasDialogOpen} setIsOpen={setIsAliasDialogOpen} />
      <ChangeRoomName roomId={roomId} isOpen={isRoomNameDialogOpen} setIsOpen={setIsRoomNameDialogOpen} />
    </>
  );
}
