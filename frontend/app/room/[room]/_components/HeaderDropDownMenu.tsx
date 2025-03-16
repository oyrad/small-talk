import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PropsWithChildren, useState } from 'react';
import { useDeleteRoomMutation } from '@/hooks/use-delete-room-mutation';
import { useRouter } from 'next/navigation';
import { Copy, SquarePen, Trash, UserRoundPen } from 'lucide-react';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';
import { ChangeRoomName } from '@/app/room/[room]/_components/ChangeRoomName';

interface HeaderDropDownMenuProps extends PropsWithChildren {
  onCopyLink: VoidFunction;
  userId: string;
  roomCreatorId: string;
  roomId: string;
}

export function HeaderDropDownMenu({ onCopyLink, userId, roomCreatorId, roomId, children }: HeaderDropDownMenuProps) {
  const [isAliasDialogOpen, setIsAliasDialogOpen] = useState(false);
  const [isRoomNameDialogOpen, setIsRoomNameDialogOpen] = useState(false);

  const { push } = useRouter();

  const isUserRoomCreator = userId === roomCreatorId;

  const { mutate: deleteRoom } = useDeleteRoomMutation({
    onSuccess: () => {
      push('/');
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4">
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

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600" onClick={() => deleteRoom(roomId)}>
                <Trash className="text-red-600" />
                Delete room
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeUserAlias userId={userId} isOpen={isAliasDialogOpen} setIsOpen={setIsAliasDialogOpen} />
      <ChangeRoomName roomId={roomId} isOpen={isRoomNameDialogOpen} setIsOpen={setIsRoomNameDialogOpen} />
    </>
  );
}
