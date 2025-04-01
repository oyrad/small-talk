export const DISAPPEARING_MESSAGES = {
  DISABLED: 'Disabled',
  TEN_MINUTES: '10 minutes',
  THIRTY_MINUTES: '30 minutes',
  ONE_HOUR: '1 hour',
  ONE_DAY: '1 day',
} as const;

export type DisappearingMessages = (typeof DISAPPEARING_MESSAGES)[keyof typeof DISAPPEARING_MESSAGES];
