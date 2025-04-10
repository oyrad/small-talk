export const EVENT_TYPE = {
  MESSAGE: 'message',
  ROOM_CREATED: 'room-created',
  ROOM_NAME_CHANGED: 'room-name-changed',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
} as const;

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];
