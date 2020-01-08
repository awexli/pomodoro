function init () {
  // make this all less redundant
  const secs = document.querySelector('#seconds');
  const mins = document.querySelector('#minutes');
  
  const startBtn = document.querySelector('#start');
  const stopBtn = document.querySelector('#stop');
  const resetBtn = document.querySelector('#reset');
  const loopBtn = document.querySelector('#loop');
  
  const pomodoroBtn = document.querySelector('#pomodoro');
  const shortBreakBtn = document.querySelector('#short-break');
  const longBreakBtn = document.querySelector('#long-break');

  // timer buttons = buttons on top of clock
  const timers = document.querySelector('#timers');
  const timerButtons = timers.childNodes;
  
  const adjustButtons = document.querySelectorAll('.adjust-button');

  let startTimer;
  let end = false;
  let looping = false;
  let loops = 0;
  let count = 0;
  let pomoTime = 25;
  let shortTime = 5;
  let longTime = 15;

  // ****************************** BUTTONS *********************************** // 
  startBtn.addEventListener('click', () => {
    starTime(true, false);
  });

  stopBtn.addEventListener('click', () => {
    window.clearInterval(startTimer);
    stopBtn.disabled = true;
    startBtn.disabled = false;
  });

  resetBtn.addEventListener('click', () => {
    resetTimer(false, pomoTime);
    buttonsDisabled(timerButtons, false);
    looping = false;
  });

  pomodoroBtn.addEventListener('click', () => {
    resetTimer(true, pomoTime);
  });

  shortBreakBtn.addEventListener('click', () => {
    resetTimer(true, shortTime);
  });

  longBreakBtn.addEventListener('click', () => {
    resetTimer(true, longTime);
  });

  loopBtn.addEventListener('click', () => {
    buttonsDisabled(adjustButtons, true);
    buttonsDisabled(timerButtons, true);
    looping = true;
    loops = 0;
    count = 0;

    resetTimer(true, pomoTime);
  });

  function listenAdjustButtons() {
    let timer = null;

      /**
     * Increments or decrements minutes
     * @param  {number} operation 1 or -1
     * @return {void} undefined
     */
    const incDecMinutes = (operation, m) => {
      if (operation === 1) m.innerText++;

      if (operation === -1) m.innerText--;

      if (m.innerText < 1) m.innerText = 60;

      if (m.innerText > 60) m.innerText = 1;
    }

    // Set up a custom click event handler
    adjustButtons
      .forEach(element => element.addEventListener("click", e => {
        let className = e.target.classList[1];
        let minutes;
        let id;

        if (className == 'increment') {
          id = e.target.nextElementSibling.attributes.id.value;
          minutes = document.getElementById(id);
          incDecMinutes(1, minutes);
        } else {
          id = e.target.previousElementSibling.attributes.id.value;
          minutes = document.getElementById(id);
          incDecMinutes(-1, minutes);
        }
        
        // Side effects
        if (id == 'pomo-mins') pomoTime = minutes.innerText;

        if (id == 'short-mins') shortTime = minutes.innerText;

        if (id == 'long-mins') longTime = minutes.innerText;
      }));

    // Simulate updating custom timer on hold
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
  }

  listenAdjustButtons();

  // ****************************** MAIN FUNCTIONS *********************************** // 
  
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
     playSound('./alarm.ogg');
     loopTimers();
     end = true;
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
    document.body.appendChild(audio);
    listenToRemove(audio);
  }

  /**
   * Removes the audio element from the body
   * @param  {HTMLAudioElement} audio Audio element
   * @return {void} undefined
   */
  function listenToRemove(audio) {
    document.querySelectorAll(".button").forEach(element => {
      element.addEventListener('click', () => {
        audio.remove();
      });
    });

    audio.onended = function(){
      audio.remove();
    };
  }

  /**
   * Loops one cycle of the pomodoro technique
   * @param  {void} void
   * @return {void} undefined
   */
  function loopTimers() {
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

  async function waitForAudio(button) {
    await sleep(8200);
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