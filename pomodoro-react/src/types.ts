export enum TimeId {
  'DEFAULT' = 'Work time',
  'SHORT' = 'Short break',
  'LONG' = 'Long break',
}

export type Time = { time: number; id: TimeId };
export type Settings = {
  pomo: Time;
  short: Time;
  long: Time;
};
