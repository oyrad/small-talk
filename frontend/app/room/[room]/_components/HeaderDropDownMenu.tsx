import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PropsWithChildren, useState } from 'react';
import { Copy, SquarePen, UserRoundPen } from 'lucide-react';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';
import { ChangeRoomName } from '@/app/room/[room]/_components/ChangeRoomName';
import { socket } from '@/socket/socket';

interface HeaderDropDownMenuProps extends PropsWithChildren {
  onCopyLink: VoidFunction;
  userId: string;
  roomCreatorId: string;
  roomId: string;
}

export function HeaderDropDownMenu({ onCopyLink, userId, roomCreatorId, roomId, children }: HeaderDropDownMenuProps) {
  const [isAliasDialogOpen, setIsAliasDialogOpen] = useState(false);
  const [isRoomNameDialogOpen, setIsRoomNameDialogOpen] = useState(false);

  const isUserRoomCreator = userId === roomCreatorId;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>

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
            <>
              <DropdownMenuItem onClick={() => setIsRoomNameDialogOpen(true)}>
                <SquarePen />
                Change room name
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            {socket.connected ? (
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-emerald-600" />
                <p>Connected</p>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <div className="size-3 rounded-full bg-red-600" />
                <p>Disconnected</p>
              </div>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeUserAlias userId={userId} roomId={roomId} isOpen={isAliasDialogOpen} setIsOpen={setIsAliasDialogOpen} />
      <ChangeRoomName roomId={roomId} isOpen={isRoomNameDialogOpen} setIsOpen={setIsRoomNameDialogOpen} />
    </>
  );
}
