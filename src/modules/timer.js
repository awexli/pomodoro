import {
  EnableButtons,
  DisableButtons,
  Clock,
  DefTimes,
  Element,
} from './common';
import { Thread } from './thread';

export class Timer {
  static Start = () => {
    if (!Clock.hasStarted) {
      Clock.hasStarted = true;
      Element.startButton.disabled = true;
      Element.stopButton.disabled = false;
      Clock.hasEnded = false;
      Element.clock.style.color = 'white';
    }
  };

  static Stop = () => {
    if (!Clock.hasEnded) {
      Element.startButton.disabled = false;
      Element.stopButton.disabled = true;
      Clock.hasStarted = false;
    }
  };

  static Tick = (alarmInstance) => {
    this.DecrementTime();

    const { mins, secs } = this.ProcessTime();
    this.UpdateView(mins, secs);

    if (this.isCompleted(mins, secs)) {
      this.EndProcedure(alarmInstance);
    }
  };

  static DecrementTime = () => {
    // initialize & prevent workTime property from 
    // being reset on every tick
    if (!DefTimes.workTime) {
      DefTimes.workTime = DefTimes.pomo * 60;
    }

    DefTimes.workTime -= 1;
  };

  static isCompleted = (mins, secs) => {
    return parseInt(mins) === 0 && parseInt(secs) === 0;
  };

  static EndProcedure = (alarmInstance) => {
    if (!Clock.hasEnded) {
      alarmInstance.PlayAlarm();
      // prob only need to disable stopBtn
      DisableButtons([Element.startButton, Element.stopButton]);
      Clock.hasEnded = true;
      Element.clock.style.color = 'tomato';
      Thread.Cycle(alarmInstance);
    }
  };

  static Reset = (isAutoStart, defTimer) => {
    if (!isAutoStart) {
      EnableButtons([Element.startButton, Element.stopButton]);
      Clock.hasStarted = false;
    } else {
      Element.startButton.disabled = true;
      Element.stopButton.disabled = false;
      Clock.hasStarted = true;
    }

    Clock.hasEnded = false;
    Element.clock.style.color = 'white';
    this.UpdateTime(defTimer);
  };

  static UpdateTime = (defTimer) => {
    DefTimes.workTime = defTimer * 60;
    const processed = this.ProcessTime();
    this.UpdateView(processed.mins, processed.secs);
  };

  static ProcessTime = () => {
    let minutes = parseInt(DefTimes.workTime / 60);
    let seconds = parseInt(DefTimes.workTime % 60);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return {
      mins: minutes,
      secs: seconds,
    };
  };

  static UpdateView = (currentMinutes, currentSeconds) => {
    const secs = document.getElementById('seconds');
    const mins = document.getElementById('minutes');

    mins.innerText = currentMinutes;
    secs.innerText = currentSeconds;
    document.title = `(${currentMinutes}:${currentSeconds})`;
  };
}
