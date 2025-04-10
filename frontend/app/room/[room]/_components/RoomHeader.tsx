import { Card } from '@/components/ui/card';
import { SocketConnectionIndicator } from '@/app/room/[room]/_components/SocketConnectionIndicator';
import { RoomSettings } from '@/app/room/[room]/_components/RoomSettings';
import { toast } from 'sonner';
import { Room } from '@/hooks/room/use-room-details-query';

interface RoomHeaderProps {
  room: Room;
}

export function RoomHeader({ room }: RoomHeaderProps) {
  function copyRoomLink() {
    void navigator.clipboard.writeText(window.location.href);
    toast('Room link copied.');
  }

  return (
    <header>
      <Card className="flex flex-row justify-between items-center p-2 pl-4">
        {room.name ? (
          <div onClick={copyRoomLink}>
            <div className="flex items-center gap-1.5">
              <SocketConnectionIndicator />
              <h1 className="text-lg font-semibold">{room.name}</h1>
            </div>
            <p className="text-xs text-gray-500">{room.id}</p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <SocketConnectionIndicator />
            <p className="text-xs font-semibold cursor-pointer justify-self-start w-fit" onClick={copyRoomLink}>
              {room.id}
            </p>
          </div>
        )}

        <RoomSettings onCopyLink={copyRoomLink} room={room} />
      </Card>
    </header>
  );
}
