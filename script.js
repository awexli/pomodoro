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
  const timerButtons = document.querySelector('.timers');
  const timerChildren = timerButtons.childNodes;

  const pomodoroBtn = document.querySelector('#pomodoro');
  const shortBreakBtn = document.querySelector('#short-break');
  const longBreakBtn = document.querySelector('#long-break');

  let startTimer;
  let end = false;
  let looping = false;
  let loops = 0;
  let count = 0;

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
    if (secs.innerText <= 0 && mins.innerText <= 0) {
      window.clearInterval(startTimer);
      disableStartStopButtons();
      disableIncDecButtons();
      end = true;
      
      playSound('./alarm.mp3');

      // loop one cycle
      if (looping && loops != 3) {
        count++;
        if (count > 2) {
          count = 1;
          loops++;
        }

        if (count == 1) shortBreakBtn.click();
        if (count == 2) pomodoroBtn.click();
      }
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

  function playSound(url){
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.setAttribute("id", "alarm");
    audio.src = url;
    audio.autoplay = true;
    audio.onended = function(){
      audio.remove() //Remove when played.
    };
    document.body.appendChild(audio);
  }

  function disableIncDecButtons() {
    incrementBtn.disabled = true;
    decrementBtn.disabled = true;
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
    incrementBtn.disabled = false;
    decrementBtn.disabled = false;
  }

  function enableTimerButtons() {
    for (let i = 0; i < timerChildren.length; i++) {
      timerChildren[i].disabled = false;
    }
  }
  
  // ****************************** BUTTONS *********************************** // 
  startBtn.addEventListener('click', () => {
    starTime(true, false);
  });

  stopBtn.addEventListener('click', () => {
    window.clearInterval(startTimer)
    stopBtn.disabled = true;
    startBtn.disabled = false;
  });

  resetBtn.addEventListener('click', () => {
    resetTimer(false, 25);
    looping = false;
    enableTimerButtons();
  });

  pomodoroBtn.addEventListener('click', () => {
    resetTimer(true, 25);
  });

  shortBreakBtn.addEventListener('click', () => {
    resetTimer(true, 5);
  });

  longBreakBtn.addEventListener('click', () => {
    resetTimer(true, 15);
  });

  incrementBtn.addEventListener('click', () => {
    mins.innerText++;
    mins.innerText = mins.innerText < 10 ? '0' + mins.innerText : mins.innerText;
    decrementBtn.disabled = false;
  });

  decrementBtn.addEventListener('click', () => {
    mins.innerText--;
    mins.innerText = mins.innerText < 10 ? '0' + mins.innerText : mins.innerText;
    if (mins.innerText <= 0) decrementBtn.disabled = true;
  });

  loopBtn.addEventListener('click', () => {
    disableIncDecButtons();
    disableTimerButtons();
    looping = true;
    loops = 0;
    count = 0;

    resetTimer(true, 25);
  });
}

window.onload = function () {
  this.init()
};