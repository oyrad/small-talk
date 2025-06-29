'use client';

import { useEffect, useState } from 'react';
import { useCreateUserMutation } from '@/hooks/user/use-create-user-mutation';
import { useUserStore } from '@/stores/use-user-store';

export function InitializeUser() {
  const [firstRender, setFirstRender] = useState(true);
  const { userId, setUserId } = useUserStore();

  const { mutate: createUser } = useCreateUserMutation({
    onSuccess: (data) => {
      console.log({ data });
      setUserId(data.id);
    },
  });

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (!userId) {
      createUser();
    }
  }, [userId, createUser, setUserId, firstRender]);

  return null;
}
