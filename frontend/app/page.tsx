'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/use-user-store';
import { useState } from 'react';
import { useGetUserByIdQuery } from '@/hooks/user/use-get-user-by-id-query';
import { ArrowRight, Edit, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CreateRoom } from '@/app/_components/CreateRoom';
import { Loader } from '@/app/_components/Loader';
import Link from 'next/link';
import { CHANGE_ALIAS_FORM_LOCATION } from '@/types/change-user-alias-location';
import { ChangeUserAlias } from '@/app/room/[room]/_components/ChangeUserAlias';

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
      <Card className="flex flex-row justify-between items-center w-full py-2 px-4 text-xs">
        <div className="flex flex-col gap-0.5">
          {userAlias ? (
            <div>
              <p className="text-lg font-semibold">{userAlias}</p>
              <p className="mb-2 text-gray-600">{userId}</p>
            </div>
          ) : (
            <p className="font-semibold">{userId}</p>
          )}
        </div>

        <ChangeUserAlias
          location={CHANGE_ALIAS_FORM_LOCATION.HOME}
          userId={userId ?? ''}
          isOpen={isAliasModalOpen}
          setIsOpen={setIsAliasModalOpen}
        >
          <Button variant="outline" size="icon">
            <Edit className="size-5" />
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
