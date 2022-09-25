export enum TimeId {
  'DEFAULT' = 'Work time',
  'SHORT' = 'Short break',
  'LONG' = 'Long break',
}

export type Time = { time: number; id: TimeId };