function init () {
  const secs = document.querySelector('#seconds');
  const mins = document.querySelector('#minutes');
  
  const startBtn = document.querySelector('#start');
  const stopBtn = document.querySelector('#stop');
  
  // Timer buttons
  const pomodoroBtn = document.querySelector('#pomo');
  const shortBreakBtn = document.querySelector('#short');
  const longBreakBtn = document.querySelector('#long');
  
  const adjustButtons = document.querySelectorAll('.adjust-button');
  const timerButtons = document.querySelectorAll('.timer-button');

  let startTimer;
  let end = false;
  let looping = false;
  let loops = 0;
  let count = 0;
  let pomoTime = 25;
  let shortTime = 5;
  let longTime = 15;

  document.addEventListener("click", e => {
    switch(e.target.id) {
      case 'start':
        timer.start();
        break;
      case 'stop':
        thread.stop();
        break;
      case 'reset':
        thread.reset();
        break;
      case 'loop':
        thread.loop();
        break;
      case 'pomo':
        timer.reset(true, pomoTime);
        break;
      case 'short':
        timer.reset(true, shortTime);
        break;
      case 'long':
        timer.reset(true, longTime);
        break;
      default:
        break;
    }

    if (e.target.classList[1] == "increment") {
      settings.incDecMinutes(e, true);
    }

    if (e.target.classList[1] == "decrement") {
      settings.incDecMinutes(e, false);
    }
  })

  // ****************************** MAIN *********************************** // 
  const timer = (() => {

    const start = () => {
      tick();
      startTimer = setInterval(tick, 1000);
      startBtn.disabled = true;
      stopBtn.disabled = false;
      end = false;
    }

    const tick = () => {
      checkEnd();

      if (secs.innerText <= 0 && !end) {
        secs.innerText = 60;

        if (mins.innerText != 0) mins.innerText--;

        if (mins.innerText < 10 && secs.innerText == 60){
          mins.innerText = "0" + mins.innerText;
        } 
      }

      if (!end) {
        secs.innerText--;
        secs.innerText = secs.innerText < 10 ? "0" + secs.innerText : secs.innerText;
      } 
      
      document.title = `(${mins.innerText}:${secs.innerText}) Pomodoro`;
    }
    
    const checkEnd = () => {
      // prevents audio.play() from being called when spamming start and stop
      if (secs.innerText <= 1 && mins.innerText <= 0) {
        secs.innerText--;
        secs.innerText = secs.innerText < 10 ? "0" + secs.innerText : secs.innerText;
      }
 
      if (secs.innerText <= 0 && mins.innerText <= 0) {
        clearInterval(startTimer);
        buttonsDisabled([startBtn, stopBtn], true);
        audio.play();
        end = true;
        cycle();
      }
    }

    /**
     * Loops one cycle of the pomodoro technique
     * @param  {void} void
     * @return {void} undefined
     */
    const cycle = () => {
      if (end && looping && loops != 3) {
        count++;
  
        if (count > 2) {
          count = 1;
          loops++;
        }
  
        if (loops == 3 && count == 1) {
          audio.waitThen(longBreakBtn);
        } else if (count == 1) {
          audio.waitThen(shortBreakBtn);
        }
  
        if (count == 2) audio.waitThen(pomodoroBtn);
      }
    }

    const reset = (autoStart, min) => {
      if (!autoStart) {
        clearInterval(startTimer)
        buttonsDisabled([startBtn, stopBtn], false);
        buttonsDisabled(adjustButtons, false);
      } else {
        clearInterval(startTimer)
        startTimer = setInterval(tick, 1000);
        startBtn.disabled = true;
        stopBtn.disabled = false;
      }
      
      secs.innerText = '0' + 0;
      mins.innerText = min < 10 ? '0' + min : min;
      document.title = `(${mins.innerText}:${secs.innerText}) Pomodoro`;
      end = false;
    }

    return { start, reset };
  })();

  // ****************************** THREADS *********************************** // 
  const thread = (() => {

    const loop = () => {
      buttonsDisabled(adjustButtons, true);
      buttonsDisabled(timerButtons, true);
      timer.reset(true, pomoTime);
      looping = true;
      loops = 0;
      count = 0;
    }

    const reset = () => {
      timer.reset(false, pomoTime);
      buttonsDisabled(timerButtons, false);
      looping = false;
    }

    const stop = () => {
      clearInterval(startTimer);
      stopBtn.disabled = true;
      startBtn.disabled = false;
    }

    return { loop, reset, stop }
  })();

  // ****************************** SETTINGS *********************************** // 
  const settings = (() => {

    const incDecMinutes = (e, isInc) => {
      let num;
      let id;
      
      if (isInc) {
        id = e.target.nextElementSibling.id
        num = 1;
      } else {
        id = e.target.previousElementSibling.id
        num = -1;
      }

      update(id, num);
    }

    const update = (id, operater) => {
      const min = document.getElementById(id);

      if (operater === 1) {
        min.innerText++;
      } else {
        min.innerText--;
      }

      if (min.innerText < 1) {
        min.innerText = 60;
      }

      if (min.innerText > 60) {
        min.innerText = 1;
      }

      apply(id, min);
    }

    const apply = (id, min) => {
      if (id == 'pomo-mins') pomoTime = min.innerText;

      if (id == 'short-mins') shortTime = min.innerText;

      if (id == 'long-mins') longTime = min.innerText;
    }

    let timer = null;
    // simulate press and hold
    adjustButtons
      .forEach(element => element.addEventListener('mousedown', evt => {
        timer = setInterval(() => {
          evt.target.click();
        }, 120);
      }));
      
    adjustButtons
        .forEach(element => element.addEventListener("mouseup", () => {
          clearInterval(timer);
      }));

    // If the mouse is dragged out of the original element
    // and then the mouse is released, the timer will stop
    adjustButtons
      .forEach(element => element.addEventListener("mouseleave", () => {
        clearInterval(timer);
      }));
    
    return { incDecMinutes };
  })();

  // ****************************** AUDIO *********************************** // 
  const audio = (() => {
    const alarm = new Audio("./alarm.wav");

    const play = () =>{
      alarm.play();

      let loopAlarm = setInterval(() => {
        alarm.play();
      }, 1000)

      listenToRemove(loopAlarm);
    }

    const listenToRemove = (loop) => {
      document.querySelectorAll(".buttons").forEach(element => {
        element.addEventListener('click', () => {
          clearInterval(loop);
        });
      });
  
      defaultWaitAudio(loop);
    }

    async function defaultWaitAudio(loop) {
      await sleep(9200);
      clearInterval(loop);
    }

    async function waitThen(button) {
      await sleep(9200);
      button.disabled = false;
      button.click();
      button.disabled = true;
    }

    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    return { play, waitThen }
  })();

  function buttonsDisabled(buttons, bool) {
    buttons.forEach(button => {
      button.disabled = bool;
    });
  }
}

init();

// cache
// make less use of local variables