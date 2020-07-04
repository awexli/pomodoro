import { LoopProps, DisableButtons, EnableButtons, DefTimes, TimeProps } from './common';
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
  }
}
