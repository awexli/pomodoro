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
