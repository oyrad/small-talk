import { socket } from '@/socket';
import { useEffect, useState } from 'react';

export function useMessagesSocket() {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  return { connected };
}
