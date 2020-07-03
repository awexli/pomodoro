import { Modal } from './modules/modal';
import { Setting } from './modules/settings';
import { AudioService } from './modules/audio-service';

function init() {
  // default times
  const def = {
    pomo: 25,
    short: 5,
    long: 15,
  };

  const defSaved = {
    pomoSaved: 25,
    shortSaved: 5,
    longSaved: 15,
  };

  const time = {
    work: def.pomo * 60,
  };

  let started = false;

  const modalInfo = new Modal(document.getElementById('modal-info'));
  const modalSettings = new Modal(document.getElementById('modal-settings'));

  const audioUrl = require('./assets/complete.mp3')
  const alarm = new Audio(audioUrl);
  const CompleteAudio = new AudioService(0.5, 0.5, 50, alarm);

  document.addEventListener('click', (e) => {
    if (e.target.parentElement !== null) {
      switch (e.target.id || e.target.parentElement.id) {
        case 'start':
          timer.start();
          break;
        case 'stop':
          timer.stop();
          break;
        case 'reset':
          thread.reset();
          break;
        case 'loop':
          thread.loop();
          break;
        case 'pomo':
          timer.reset(true, def.pomo);
          break;
        case 'short':
          timer.reset(true, def.short);
          break;
        case 'long':
          timer.reset(true, def.long);
          break;
        default:
          break;
      }
    }

    if (e.target.classList[1] == 'increment') {
      Setting.AdjustMinutes(e, true);
    }

    if (e.target.classList[1] == 'decrement') {
      Setting.AdjustMinutes(e, false);
    }

    if (e.target.id === 'for-info') {
      modalInfo.openModal();
    }

    if (e.target.id === 'for-settings') {
      modalSettings.openModal();
    }

    if (e.target.className.includes('delete')) {
      modalInfo.closeModal();
      modalSettings.closeModal();
    }

    if (e.target.className === 'modal-background') {
      modalInfo.closeModal();
      modalSettings.closeModal();
    }

    if (e.target.className.includes('is-success')) {
      Setting.SaveAdjustMinutes(def, defSaved);
      Setting.SaveVolumeChanges(CompleteAudio);
      thread.reset(false, def.pomo);
      modalSettings.closeModal();
    }

    if (e.target.className.includes('cancel')) {
      Setting.RevertAdjustMinutes(def, defSaved);
      Setting.RevertVolumeChanges(CompleteAudio);
      modalSettings.closeModal();
    }
  });

  Setting.ListenToAdjustButtons();
  Setting.ListenToAdustVolume(CompleteAudio);

  window.setInterval(() => {
    timer.tickTock();
  }, 1000);

  // ======================//
  //      MAIN (TIMER)
  // ======================//
  const timer = (() => {
    const secs = document.querySelector('#seconds');
    const mins = document.querySelector('#minutes');
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const clock = document.querySelector('#clock');

    let end = false;

    const start = () => {
      if (!started) {
        started = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        end = false;
        clock.style.color = 'black';
      }
    };

    const tickTock = () => {
      if (started && !end) {
        time.work -= 1;
        const processed = processTime();
        updateView(processed.min, processed.sec);
        if (parseInt(processed.min) === 0 && parseInt(processed.sec) === 0) {
          endProcedure();
        }
      }
    };

    const processTime = () => {
      let minutes = parseInt(time.work / 60);
      let seconds = parseInt(time.work % 60);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      return {
        min: minutes,
        sec: seconds,
      };
    };

    const updateView = (currentMin, currentSec) => {
      mins.innerText = currentMin;
      secs.innerText = currentSec;
      document.title = `(${currentMin}:${currentSec})`;
    };

    const updateTime = (defTimer) => {
      time.work = defTimer * 60;
      const processed = processTime();
      updateView(processed.min, processed.sec);
    };

    const endProcedure = () => {
      if (!end) {
        CompleteAudio.PlayAlarm();
        buttonsDisabled([startBtn, stopBtn], true);
        end = true;
        clock.style.color = 'tomato';
        thread.cycle();
      }
    };

    const stop = () => {
      if (!end) {
        stopBtn.disabled = true;
        startBtn.disabled = false;
        started = false;
      }
    };

    const reset = (autoStart, defTimer) => {
      if (!autoStart) {
        buttonsDisabled([startBtn, stopBtn], false);
        started = false;
      } else {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        started = true;
      }
      end = false;
      clock.style.color = 'black';
      updateTime(defTimer);
    };

    const isEnd = () => {
      return end;
    };

    return { start, stop, reset, isEnd, tickTock };
  })();

  // ======================//
  //    THREADS (LOOPS)
  // ======================//
  const thread = (() => {
    const timerButtons = document.querySelectorAll('.timer-button');
    const [pomoBtn, shortBtn, longBtn] = timerButtons;

    let looping = false;
    let loops = 0;
    let count = 0;

    const loop = () => {
      buttonsDisabled(timerButtons, true);
      timer.reset(true, def.pomo);
      looping = true;
      loops = 0;
      count = 0;
      started = true;
    };

    /**
     * Loops one cycle of the pomodoro technique
     * @param  {void} void
     * @return {void} undefined
     */
    const cycle = () => {
      if (timer.isEnd() && looping && loops != 3) {
        count++;

        if (count > 2) {
          count = 1;
          loops++;
        }

        if (loops == 3 && count == 1) {
          CompleteAudio.WaitThenDisable(longBtn);
        } else if (count == 1) {
          CompleteAudio.WaitThenDisable(shortBtn);
        }

        if (count == 2) CompleteAudio.WaitThenDisable(pomoBtn);
      }
    };

    const reset = () => {
      timer.reset(false, def.pomo);
      buttonsDisabled(timerButtons, false);
      looping = false;
    };

    return { loop, reset, cycle };
  })();

  function buttonsDisabled(buttons, bool) {
    buttons.forEach((button) => {
      button.disabled = bool;
    });
  }
}

window.onload = init();
