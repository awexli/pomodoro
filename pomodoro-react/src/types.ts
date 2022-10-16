import { ButtonProps } from '@chakra-ui/button';

export enum TimeId {
  'WORK' = 'Work',
  'SHORT' = 'Short break',
  'LONG' = 'Long break',
}
export type Time = { time: number; id: TimeId };
export type Settings = {
  pomo: Time;
  short: Time;
  long: Time;
};

// UI
export type ModifiedButtonProps = ButtonProps & { icon: React.ReactNode };
