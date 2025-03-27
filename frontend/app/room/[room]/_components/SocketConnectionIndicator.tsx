import { socket } from '@/socket/socket';
import { useEffect, useState } from 'react';

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

  if (isConnected) {
    return (
      <div className="flex gap-2 items-center">
        <div className="size-3 rounded-full bg-emerald-600" />
        <p>Connected</p>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="size-3 rounded-full bg-red-600" />
      <p>Disconnected</p>
    </div>
  );
}
