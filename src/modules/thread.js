import {
  LoopProps,
  DisableButtons,
  EnableButtons,
  DefTimes,
  TimeProps,
} from './common';
import { Timer } from './timer';

export class Thread {
  static Loop = () => {
    const timerButtons = document.querySelectorAll('.timer-button');

    DisableButtons(timerButtons);
    Timer.Reset(true, DefTimes.pomo);
    LoopProps.looping = true;
    LoopProps.loops = 0;
    LoopProps.count = 0;
    TimeProps.hasStarted = true;
  };

  static Reset = () => {
    const timerButtons = document.querySelectorAll('.timer-button');

    Timer.Reset(false, DefTimes.pomo);
    EnableButtons(timerButtons);
    LoopProps.looping = false;
  };

  static Cycle = (Audio) => {
    const timerButtons = document.querySelectorAll('.timer-button');
    //let { looping, loops, count } = LoopProps;
    const [pomoBtn, shortBtn, longBtn] = timerButtons;

    if (TimeProps.hasEnded && LoopProps.looping && LoopProps.loops !== 3) {
      LoopProps.count++;

      if (LoopProps.count > 2) {
        LoopProps.count = 1;
        LoopProps.loops++;
      }

      if ((LoopProps.loops === 3) & (LoopProps.count === 1)) {
        console.log('Next up - long break: ', DefTimes.long + 'min(s)');
        Audio.WaitThenDisable(longBtn);
      } else if (LoopProps.count === 1) {
        console.log('Next up - short break: ', DefTimes.short + 'min(s)');
        Audio.WaitThenDisable(shortBtn);
      }

      if (LoopProps.count === 2) {
        console.log('Next up - pomo: ', DefTimes.pomo + 'min(s)');
        Audio.WaitThenDisable(pomoBtn);
      }
    }
  };
}
