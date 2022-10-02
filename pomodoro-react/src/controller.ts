import { Settings } from '../src/types';

export class Controller {
  static loadSettings({ pomo, short, long }: Settings): Settings {
    return JSON.parse(localStorage.getItem('pomodoro')) || { pomo, short, long };
  }

  static saveSettings({ pomo, short, long }: Settings) {
    localStorage.setItem('pomodoro', JSON.stringify({ pomo, short, long }));
  }
}
