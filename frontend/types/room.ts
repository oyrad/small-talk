export interface Room {
  id: string;
  name: string;
  password: string;
  users: Array<string>;
  createdAt: string;
}
