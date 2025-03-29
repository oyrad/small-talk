import { socket } from '@/socket/socket';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function SocketConnectionIndicator() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return <div className={cn('size-3 min-w-3 rounded-full bg-red-600', isConnected && 'bg-emerald-600')} />;
}
