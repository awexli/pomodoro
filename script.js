function init () {
  const startBtn = document.getElementById('start');
  const stopBtn = document.getElementById('stop');
  const resetBtn = document.getElementById('reset');
  const pomodoroBtn = document.querySelector('#pomodoro');
  const shortBreakBtn = document.querySelector('#short-break');
  const longBreakBtn = document.querySelector('#long-break');
  const secs = document.getElementById('seconds');
  const mins = document.getElementById('minutes');
  let startTimer;

  function myTimer () {
    if (secs.innerText <= 0) {
      secs.innerText = 60;
      mins.innerText--;
      if (mins.innerText < 10 && secs.innerText == 60){
        mins.innerText = "0" + mins.innerText;
      } 
    }

    secs.innerText--;

    secs.innerText = secs.innerText < 10 ? "0" + secs.innerText : secs.innerText;
     
    // bug with clearInterval() allows spamming start and stop
    // at the last second (ex. 00:01) to bypass this
    if (secs.innerText <= 0 && mins.innerText <= 0) {
      window.clearInterval(startTimer);
      startBtn.disabled = true;
      stopBtn.disabled = true;
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
    
  }
  
  // buttons *******************************************************************
  startBtn.addEventListener('click', () => {
    myTimer();
    startTimer = setInterval(myTimer, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
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
}

window.onload = function () {
  this.init()
};