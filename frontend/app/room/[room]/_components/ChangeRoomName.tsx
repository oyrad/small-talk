import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ChangeRoomName() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-left mb-2">Change room name</DialogTitle>
        <DialogDescription>
          <form className="flex gap-2">
            <Input placeholder="New room name" />
            <Button>Save</Button>
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
