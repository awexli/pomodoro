function init () {
  const startBtn = document.querySelector('#start');
  const stopBtn = document.querySelector('#stop');
  const resetBtn = document.querySelector('#reset');
  const pomodoroBtn = document.querySelector('#pomodoro');
  const shortBreakBtn = document.querySelector('#short-break');
  const longBreakBtn = document.querySelector('#long-break');
  const incrementBtn = document.querySelector('#increment');
  const decrementBtn = document.querySelector('#decrement');
  const loopBtn = document.querySelector('#loop');
  const secs = document.querySelector('#seconds');
  const mins = document.querySelector('#minutes');
  
  let startTimer;
  let end = false;

  function myTimer () {
    checkTimer();

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

  function checkTimer () {
    if (secs.innerText <= 0 && mins.innerText <= 0) {
      window.clearInterval(startTimer);
      startBtn.disabled = true;
      stopBtn.disabled = true;
      decrementBtn.disabled = true;
      incrementBtn.disabled = true;
      end = true;
      // play alarm
    }
  }

  function resetTimer (autoStart, min) {
    if (!autoStart) {
      window.clearInterval(startTimer)
      startBtn.disabled = false;
      stopBtn.disabled = false;
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

  function starTime (startPressed, loopPressed) {
    // check if loop is already pressed
    myTimer();
    startTimer = setInterval(myTimer, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    end = false;
  }
  
  // buttons *******************************************************************
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
  });

  pomodoroBtn.addEventListener('click', () => {
    resetTimer(true, 25);
  });

  shortBreakBtn.addEventListener('click', () => {
    resetTimer(true, 5);
  });

  longBreakBtn.addEventListener('click', () => {
    resetTimer(true, 30);
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
    starTime(true, false);
  });
}

window.onload = function () {
  this.init()
};