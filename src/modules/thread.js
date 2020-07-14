import {
  LoopProps,
  DisableButtons,
  EnableButtons,
  DefTimes,
  Clock,
  Element,
} from './common';
import { Timer } from './timer';

export class Thread {
  static Loop = () => {
    DisableButtons(Element.timerButtons);
    Timer.Reset(true, DefTimes.pomo);
    LoopProps.looping = true;
    LoopProps.loops = 0;
    LoopProps.count = 0;
    Clock.hasStarted = true;
  };

  static Reset = () => {
    Timer.Reset(false, DefTimes.pomo);
    EnableButtons(Element.timerButtons);
    LoopProps.looping = false;
  };

  static Cycle = (Audio) => {
    const [pomoBtn, shortBtn, longBtn] = Element.timerButtons;

    if (Clock.hasEnded && LoopProps.looping && LoopProps.loops !== 3) {
      LoopProps.count++;

      if (LoopProps.count > 2) {
        LoopProps.count = 1;
        LoopProps.loops++;
      }

      if ((LoopProps.loops === 3) && (LoopProps.count === 1)) {
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
