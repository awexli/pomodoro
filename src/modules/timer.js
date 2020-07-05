import { EnableButtons, DisableButtons, Clock, DefTimes } from './common';
import { Thread } from './thread';

export class Timer {
  static Start = () => {
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const clockElement = document.querySelector('#clock');

    if (!Clock.hasStarted) {
      Clock.hasStarted = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      Clock.hasEnded = false;
      clockElement.style.color = 'white';
    }
  };

  static Stop = () => {
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');

    if (!Clock.hasEnded) {
      stopBtn.disabled = true;
      startBtn.disabled = false;
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
    // prevent workTime property from being reset on every tick
    if (!DefTimes.workTime) {
      DefTimes.workTime = DefTimes.pomo * 60;
    }

    DefTimes.workTime -= 1;
  };

  static isCompleted = (mins, secs) => {
    return parseInt(mins) === 0 && parseInt(secs) === 0;
  };

  static EndProcedure = (alarmInstance) => {
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const clockElement = document.querySelector('#clock');

    if (!Clock.hasEnded) {
      alarmInstance.PlayAlarm();
      // prob only need to disable stopBtn
      DisableButtons([startBtn, stopBtn]);
      Clock.hasEnded = true;
      clockElement.style.color = 'tomato';
      Thread.Cycle(alarmInstance);
    }
  };

  static Reset = (isAutoStart, defTimer) => {
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const clock = document.querySelector('#clock');

    if (!isAutoStart) {
      EnableButtons([startBtn, stopBtn]);
      Clock.hasStarted = false;
    } else {
      stopBtn.disabled = false;
      startBtn.disabled = true;
      Clock.hasStarted = true;
    }

    Clock.hasEnded = false;
    clock.style.color = 'white';
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
    const secs = document.querySelector('#seconds');
    const mins = document.querySelector('#minutes');

    mins.innerText = currentMinutes;
    secs.innerText = currentSeconds;
    document.title = `(${currentMinutes}:${currentSeconds})`;
  };
}
