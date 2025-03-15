import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

interface UserStore {
  userId: string | null;
  userAlias: string | null;
  setUserId: (id: string) => void;
  setUserAlias: (alias: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      userAlias: null,
      setUserId: (id) => set({ userId: id }),
      setUserAlias: (alias) => set({ userAlias: alias }),
    }),
    {
      name: 'user',
      version: 0,
    },
  ),
);
