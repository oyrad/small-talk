'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/use-user-store';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';
import { useState } from 'react';
import { useGetUserByIdQuery } from '@/hooks/use-get-user-by-id-query';
import { ArrowRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateRoom } from '@/app/_components/CreateRoom';

export default function Home() {
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const { userId, userAlias } = useUserStore();
  const { push } = useRouter();

  const { data: user } = useGetUserByIdQuery(userId ?? '');

  return (
    <div className="flex flex-col h-fit p-6 gap-3">
      <Card className="w-full py-2.5 px-4 gap-0.5 text-xs">
        <p className="text-lg font-semibold">{userAlias}</p>
        <p className="mb-2">User id: {userId}</p>

        <ChangeUserAlias userId={userId ?? ''} isOpen={isAliasModalOpen} setIsOpen={setIsAliasModalOpen}>
          <Button className="w-full" variant="outline">
            Change alias
          </Button>
        </ChangeUserAlias>
      </Card>

      {user?.rooms.length && (
        <Card className="flex flex-col gap-3 w-full px-4 py-3 h-fit">
          <div className="flex items-center justify-between">
            <p className="font-semibold"> My rooms</p>

            <CreateRoom isOpen={isCreateRoomModalOpen} setIsOpen={setIsCreateRoomModalOpen}>
              <Button size="icon">
                <Plus className="size-5" />
              </Button>
            </CreateRoom>
          </div>

          <hr />

          <div className="flex flex-col gap-4 max-h-96 overflow-y-scroll">
            {user?.rooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{room.name}</p>
                  <p className={cn('text-xs', !room.name && 'font-semibold')}>{room.id}</p>
                </div>

                <Button size="icon" variant="outline" onClick={() => push(`/room/${room.id}`)}>
                  <ArrowRight />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
