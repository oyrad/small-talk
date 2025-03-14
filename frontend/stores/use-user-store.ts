import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface UserIdStore {
  userId: string;
  userAlias: string | null;
  setUserAlias: (alias: string) => void;
  initializeUserId: VoidFunction;
}

export const useUserStore = create<UserIdStore>()(
  persist(
    (set, get) => ({
      userId: '',
      userAlias: null,
      setUserAlias: (alias) => set({ userAlias: alias }),
      initializeUserId: () => {
        if (get().userId) return;

        const storedUserId = localStorage.getItem('user-id');
        const newUserId = storedUserId || uuidv4();

        set({ userId: newUserId });

        localStorage.setItem('user-id', newUserId);
      },
    }),
    {
      name: 'user-id',
      version: 0,
    },
  ),
);
