export const LoopProps = {
  looping: false,
  loops: 0,
  count: 0,
};

export const DefTimes = {
  pomo: 25,
  short: 5,
  long: 15,
  pomoSaved: 25,
  shortSaved: 5,
  longSaved: 15,
};

export const Clock = {
  hasStarted: false,
  hasEnded: false,
};

export const Element = {
  pomoMins: document.getElementById('pomo-mins'),
  shortMins: document.getElementById('short-mins'),
  longMins: document.getElementById('long-mins'),
  volumeControl: document.getElementById('vol-control'),
  percentage: document.getElementById('percentage'),
  timerButtons: document.querySelectorAll('.timer-button'),
  startButton: document.getElementById('start'),
  stopButton: document.getElementById('stop'),
  clock: document.getElementById('clock'),
};

export const DisableButtons = (buttons) => {
  buttons.forEach((button) => {
    button.disabled = true;
  });
};

export const EnableButtons = (buttons) => {
  buttons.forEach((button) => {
    button.disabled = false;
  });
};
