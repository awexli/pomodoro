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

  // ****************************** BUTTONS *********************************** //
  document.addEventListener("click", e => {
    switch(e.target.id) {
      case 'start':
        starTime(true, false);
        break;
      case 'stop':
        stopThread();
        break;
      case 'reset':
        resetThread();
        break;
      case 'loop':
        loopThread();
        break;
      case 'pomo':
        resetTimer(true, pomoTime);
        break;
      case 'short':
        resetTimer(true, shortTime);
        break;
      case 'long':
        resetTimer(true, longTime);
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

    /**
     * Increments or decrements minutes in settings
     */
    const update = (id, operater) => {
      min = document.getElementById(id);

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

  // ****************************** MAIN FUNCTIONS *********************************** // 
  function loopThread() {
    buttonsDisabled(adjustButtons, true);
    buttonsDisabled(timerButtons, true);
    resetTimer(true, pomoTime);
    looping = true;
    loops = 0;
    count = 0;
  }

  function resetThread() {
    resetTimer(false, pomoTime);
    buttonsDisabled(timerButtons, false);
    looping = false;
  }

  function stopThread() {
    window.clearInterval(startTimer);
    stopBtn.disabled = true;
    startBtn.disabled = false;
  }

  function starTime() {
    myTimer();
    startTimer = setInterval(myTimer, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    end = false;
  }

  function myTimer() {
    checkEndTimer();

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
  }

  function checkEndTimer() {
    // prevents playSound() from being called when spamming start and stop
    if (secs.innerText <= 1 && mins.innerText <= 0) {
     secs.innerText--;
     secs.innerText = secs.innerText < 10 ? "0" + secs.innerText : secs.innerText;
    }

   if (secs.innerText <= 0 && mins.innerText <= 0) {
     window.clearInterval(startTimer);
     buttonsDisabled([startBtn, stopBtn], true);
     playSound('./alarm.wav');
     end = true;
     cycleTimers();
   }
 }

 /**
   * Appends and autoplays an audio file in the body
   * @param  {string} url Audio file path
   * @return {void} undefined
   */
  function playSound(url){
    const audio = document.createElement('audio');
    audio.style.display = "none";
    audio.setAttribute("id", "alarm");
    audio.src = url;
    audio.autoplay = true;
    audio.loop = true;
    document.body.appendChild(audio);
    listenToRemove(audio);
  }

  /**
   * Removes the audio element from the body
   * @param  {HTMLAudioElement} audio Audio element
   * @return {void} undefined
   */
  function listenToRemove(audio) {
    document.querySelectorAll(".buttons").forEach(element => {
      element.addEventListener('click', () => {
        audio.remove();
      });
    });

    defaultWaitAudio(audio);
  }

  /**
   * Loops one cycle of the pomodoro technique
   * @param  {void} void
   * @return {void} undefined
   */
  function cycleTimers() {
    if (end && looping && loops != 3) {
      count++;

      if (count > 2) {
        count = 1;
        loops++;
      }

      if (loops == 3 && count == 1) {
        waitForAudio(longBreakBtn);
      } else if (count == 1) {
        waitForAudio(shortBreakBtn);
      }

      if (count == 2) waitForAudio(pomodoroBtn);
    }
  }

  async function defaultWaitAudio(audio) {
    await sleep(9200);
    audio.remove();
  }

  async function waitForAudio(button) {
    await sleep(9200);
    button.disabled = false;
    button.click();
    button.disabled = true;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function resetTimer(autoStart, min) {
    if (!autoStart) {
      window.clearInterval(startTimer)
      buttonsDisabled([startBtn, stopBtn], false);
      buttonsDisabled(adjustButtons, false);
    } else {
      window.clearInterval(startTimer)
      startTimer = setInterval(myTimer, 1000);
      startBtn.disabled = true;
      stopBtn.disabled = false;
    }
    
    secs.innerText = '0' + 0;
    mins.innerText = min < 10 ? '0' + min : min;
    end = false;
  }

  function buttonsDisabled(buttons, bool) {
    buttons.forEach(button => {
      button.disabled = bool;
    });
  }
}

window.onload = function () {
  this.init()
};