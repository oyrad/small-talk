import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function RoomNotFound() {
  const { push } = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 h-full">
      <h1 className="text-6xl">404 Room not found</h1>
      <Button onClick={() => push('/')} className="w-full">
        Home
      </Button>
    </div>
  );
}
