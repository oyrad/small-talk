import { Room } from '@/types/room';

export interface User {
  id: string;
  alias: string;
  rooms: Array<Room>;
  createdRooms: Array<Room>;
}
