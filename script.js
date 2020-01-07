function init () {
  const secs = document.querySelector('#seconds');
  const mins = document.querySelector('#minutes');
  
  const startBtn = document.querySelector('#start');
  const stopBtn = document.querySelector('#stop');
  const resetBtn = document.querySelector('#reset');
  const loopBtn = document.querySelector('#loop');
  
  const incrementBtn = document.querySelector('#increment');
  const decrementBtn = document.querySelector('#decrement');

  // timer buttons = buttons on top of clock
  const timerButtons = document.querySelector('#timers');
  const timerChildren = timerButtons.childNodes;

  const pomodoroBtn = document.querySelector('#pomodoro');
  const shortBreakBtn = document.querySelector('#short-break');
  const longBreakBtn = document.querySelector('#long-break');

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
    looping = false;
    enableTimerButtons();
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
    disableIncDecButtons();
    disableTimerButtons();
    looping = true;
    loops = 0;
    count = 0;

    resetTimer(true, pomoTime);
  });

  // Set custom timers
  document.querySelectorAll('.adjust-button')
    .forEach(element => element.addEventListener('click', e => {
      let className = e.target.classList[1];
      let minutes
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

      if (id == 'pomo-mins') pomoTime = minutes.innerText;

      if (id == 'short-mins') shortTime = minutes.innerText;

      if (id == 'long-mins') longTime = minutes.innerText;

    }));

  // ****************************** MAIN FUNCTIONS *********************************** // 
  
  /**
   * Increments or decrements minutes
   * @param  {number} operation 1 or -1
   * @return {void} undefined
   */
  const incDecMinutes = (operation, m) => {
    if (operation === 1) m.innerText++;

    if (operation === -1) m.innerText--;

    if (m.innerText < 0) m.innerText = 60;

    if (m.innerText > 60) m.innerText = 0;
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
      disableStartStopButtons();
      disableIncDecButtons();
      end = true;
      
      playSound('./alarm.ogg');
      
      loopTimers();
    }
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitForAudio(button) {
    await sleep(8200);
    button.disabled = false;
    button.click();
    button.disabled = true;
  }

  function loopTimers() {
    if (end && looping && loops != 3) {
      count++;

      if (count > 2) {
        count = 1;
        loops++;
      }

      if (count == 1) waitForAudio(shortBreakBtn);

      if (count == 2) waitForAudio(pomodoroBtn);
    }
  }

  function resetTimer(autoStart, min) {
    if (!autoStart) {
      window.clearInterval(startTimer)
      enableStartStopButtons();
      enableIncDecButtons();
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

  function starTime() {
    myTimer();
    startTimer = setInterval(myTimer, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    end = false;
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
      audio.remove() //Remove when played.
    };
  }

  // ************************ ENABLE/DISABLE FUNCTIONS *************************** // 
  function disableIncDecButtons() {
    document.querySelectorAll('.adjust-button')
      .forEach(button => {
        button.disabled = true;
      })
  }

  function disableStartStopButtons() {
    startBtn.disabled = true;
    stopBtn.disabled = true;
  }

  function disableTimerButtons() {
    for (let i = 0; i < timerChildren.length; i++) {
      timerChildren[i].disabled = true;
    }
  }

  function enableStartStopButtons() {
    startBtn.disabled = false;
    stopBtn.disabled = false;
  }

  function enableIncDecButtons() {
    document.querySelectorAll('.adjust-button')
      .forEach(button => {
        button.disabled = false;
      })
  }

  function enableTimerButtons() {
    for (let i = 0; i < timerChildren.length; i++) {
      timerChildren[i].disabled = false;
    }
  }
}

window.onload = function () {
  this.init()
};