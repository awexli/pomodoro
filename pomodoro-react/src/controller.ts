import { Settings, TimeId } from '../src/types';

export const mockTime = {
  pomo: { time: 5 / 60, id: TimeId.WORK },
  short: { time: 3 / 60, id: TimeId.SHORT },
  long: { time: 5 / 60, id: TimeId.LONG },
};

export class Controller {
  static loadSettings({ pomo, short, long }: Settings): Settings {
    return (
      JSON.parse(localStorage.getItem('pomodoro')) || { pomo, short, long }
    );
  }

  static saveSettings({ pomo, short, long }: Settings) {
    localStorage.setItem('pomodoro', JSON.stringify({ pomo, short, long }));
  }
}
