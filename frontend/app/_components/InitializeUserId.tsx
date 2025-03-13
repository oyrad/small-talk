'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/use-user-store';

export function InitializeUserId() {
  const { initializeUserId } = useUserStore();

  useEffect(() => {
    initializeUserId();
  }, [initializeUserId]);

  return null;
}
