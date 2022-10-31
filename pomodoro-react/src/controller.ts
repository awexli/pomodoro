import { Settings, TimeId } from '../src/types';

export const mockTime = {
  pomo: { time: 5 / 60, id: TimeId.WORK },
  short: { time: 3 / 60, id: TimeId.SHORT },
  long: { time: 5 / 60, id: TimeId.LONG },
};

export class Controller {
  static loadSettings({ pomo, short, long }: Settings): Promise<Settings> {
    const settings = mockTime || {
      pomo,
      short,
      long,
    };
    return new Promise((resolve) => {
      resolve(settings);
    });
  }

  static loadCurrentTimeAndCycle({ currentTime, cycle }) {}

  static saveSettings({ pomo, short, long }: Settings) {
    localStorage.setItem('pomodoro', JSON.stringify({ pomo, short, long }));
  }

  static saveCurrentTimeAndCycle({ currentTime, cycle }) {
    localStorage.setItem(
      'pomodoro-checkpoint',
      JSON.stringify({ currentTime, cycle })
    );
  }
}
