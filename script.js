function init () {
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const resetButton = document.getElementById('reset');
  const secs = document.getElementById('seconds');
  const mins = document.getElementById('minutes');

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
     
    // bug with clearInterval allowing start and stop to bypass this
    if (secs.innerText <= 0 && mins.innerText <= 0) {
      window.clearInterval(startTimer);
      startButton.disabled = true;
      stopButton.disabled = true;
      // play alarm
    }
  }
  
  startButton.addEventListener('click', () => {
    myTimer();
    startTimer = setInterval(myTimer, 1000);
    startButton.disabled = true;
    stopButton.disabled = false;
  });

  stopButton.addEventListener('click', () => {
    window.clearInterval(startTimer)
    stopButton.disabled = true;
    startButton.disabled = false;
  });

  resetButton.addEventListener('click', () => {
    window.clearInterval(startTimer)
    secs.innerText = '0' + 0;
    mins.innerText = 25;
    stopButton.disabled = false;
    startButton.disabled = false;
  });
}

window.onload = function () {
  this.init()
};