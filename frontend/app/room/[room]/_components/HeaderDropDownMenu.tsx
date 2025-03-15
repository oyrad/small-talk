import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PropsWithChildren } from 'react';

interface HeaderDropDownMenuProps extends PropsWithChildren {
  onCopyLink: VoidFunction;
  onRoomDelete: VoidFunction;
}

export function HeaderDropDownMenu({ onCopyLink, onRoomDelete, children }: HeaderDropDownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>

      <DropdownMenuContent className="mr-4">
        <DropdownMenuItem onClick={onCopyLink}>Copy room link</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-600" onClick={onRoomDelete}>
          Delete room
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
