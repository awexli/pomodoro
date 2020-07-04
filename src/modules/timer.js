import { EnableButtons, DisableButtons, TimeProps, DefTimes } from './common';

export class Timer {
  static Start = () => {
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const clock = document.querySelector('#clock');

    if (!TimeProps.hasStarted) {
      TimeProps.hasStarted = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      TimeProps.hasEnded = false;
      clock.style.color = 'white';
    }
  }

  static Tick = (alarmInstance) => {
    if (TimeProps.hasStarted && !TimeProps.hasEnded) {
      if (!DefTimes.workTime) DefTimes.workTime = (DefTimes.pomo * 60);

      DefTimes.workTime -= 1;
      const processed = this.ProcessTime();
      this.UpdateView(processed.mins, processed.secs);

      if (parseInt(processed.mins) === 0 && parseInt(processed.secs) === 0) {
        this.EndProcedure(alarmInstance);
      }
    }
  }

  static EndProcedure = (alarmInstance) => {
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const clock = document.querySelector('#clock');

    if (!TimeProps.hasEnded) {
      alarmInstance.PlayAlarm();
      // prob just only need disable stopBtn
      DisableButtons([startBtn, stopBtn]); 
      TimeProps.hasEnded = true;
      clock.style.color = 'tomato';
      // thread.cycle();
    }
  }

  static Reset = (isAutoStart, defTimer) => {
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const clock = document.querySelector('#clock');

    if (!isAutoStart) {
      EnableButtons([startBtn, stopBtn]);
      TimeProps.hasStarted = false;
    } else {
      stopBtn.disabled = true;
      startBtn.disabled = false;
      TimeProps.hasStarted = true;
    }

    TimeProps.hasEnded = false;
    clock.style.clock = 'white';
    this.UpdateTime(defTimer);
  }

  static UpdateTime = (defTimer) => {
    DefTimes.workTime = defTimer * 60;
    console.log(DefTimes.workTime)
    const processed = this.ProcessTime();
    this.UpdateView(processed.mins, processed.secs);
  }

  static ProcessTime = () => {
    let minutes = parseInt(DefTimes.workTime / 60);
    let seconds = parseInt(DefTimes.workTime % 60);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return {
      mins: minutes,
      secs: seconds,
    }
  }

  static UpdateView = (currentMinutes, currentSeconds) => {
    const secs = document.querySelector('#seconds');
    const mins = document.querySelector('#minutes');

    mins.innerText = currentMinutes;
    secs.innerText = currentSeconds;
    document.title = `(${currentMinutes}:${currentSeconds})`;
  }
}