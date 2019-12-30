function init () {
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const resetButton = document.getElementById('reset');
  const display = document.querySelector('#timer');

  const duration = 60 * 25
  let startTime = Date.now(),
        diff,
        minutes,
        seconds;

  function myTimer () {
    // get the number of seconds that have elapsed since 
    // myTimer() was called
    diff = duration - (((Date.now() - startTime) / 1000) | 0);

    // does the same job as parseInt truncates the float
    minutes = (diff / 60) | 0;
    seconds = (diff % 60) | 0;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds; 

    if (diff <= 0) {
        // add one second so that the count down starts at the full duration
        // example 05:00 not 04:59
        startTime = Date.now() + 1000;
    }
  }

  let started = false;
  let stopped = false
  
  startButton.addEventListener('click', () => {
    if (!started || stopped) {
      myTimer();
      startTimer = setInterval(myTimer, 1000);
      started = true
      stopped = false;
    }
  });

  stopButton.addEventListener('click', () => {
    this.clearInterval(startTimer)
    stopped = true
  });

  // reset.addEventListener('click', () => {
  //   this.clearInterval(startTimer)
  //   stopped = true
  // });
}

window.onload = function () {
  this.init()
};