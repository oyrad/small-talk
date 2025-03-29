'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/use-user-store';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';
import { useState } from 'react';
import { useGetUserByIdQuery } from '@/hooks/use-get-user-by-id-query';
import { ArrowRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateRoom } from '@/app/_components/CreateRoom';
import { Loader } from '@/app/_components/Loader';
import Link from 'next/link';

export default function Home() {
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const { userId, userAlias } = useUserStore();

  const { data: user, isPending: isUserLoading } = useGetUserByIdQuery(userId ?? '');

  if (isUserLoading) {
    return <Loader />;
  }

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

      <Card className="flex flex-col gap-3 w-full px-2 py-3 h-fit">
        <div className="px-2">
          <CreateRoom isOpen={isCreateRoomModalOpen} setIsOpen={setIsCreateRoomModalOpen}>
            <Button className="w-full">
              <Plus className="size-5" />
              New room
            </Button>
          </CreateRoom>
        </div>

        {user?.rooms.length !== 0 && (
          <>
            <hr className="mx-2" />

            <div className="flex flex-col gap-4 max-h-96 overflow-y-scroll px-2">
              {user?.rooms.map((room) => (
                <Link key={room.id} className="flex items-center justify-between" href={`/room/${room.id}`}>
                  <div>
                    <p className="font-semibold">{room.name}</p>
                    <p className={cn('text-xs text-gray-500', !room.name && 'font-semibold text-slate-900')}>
                      {room.id}
                    </p>
                  </div>

                  <Button size="icon" variant="outline">
                    <ArrowRight />
                  </Button>
                </Link>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
