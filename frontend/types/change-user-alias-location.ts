export const CHANGE_ALIAS_FORM_LOCATION = {
  HOME: 'home',
  ROOM: 'room',
} as const;

export type ChangeAliasFormLocation = (typeof CHANGE_ALIAS_FORM_LOCATION)[keyof typeof CHANGE_ALIAS_FORM_LOCATION];
