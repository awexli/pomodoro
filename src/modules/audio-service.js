export class AudioService {
  constructor(currentVolume, previousVolume, previousValue, alarm) {
    this.currentVolume = currentVolume;
    this.previousVolume = previousVolume;
    this.previousValue = previousValue;
    this.alarm = alarm;
  }

  PlayAlarm = (loopAlarm) => {
    this.alarm.play();

    loopAlarm = setInterval(() => {
      this.alarm.play();
    }, 1000);

    this.ListenToStopAudio(loopAlarm);
  };

  ListenToStopAudio = (loopAlarm) => {
    document.addEventListener('click', () => {
      clearInterval(loopAlarm);
    })

    this.DefaultWaitAudio(loopAlarm);
  };

  DefaultWaitAudio = async (loopAlarm) => {
    await this.Sleep(8200);
    clearInterval(loopAlarm);
  };

  WaitThenDisable = async (button) => {
    await this.Sleep(8200);
    button.disabled = false;
    button.click();
    button.disabled = true;
  };

  Sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  get CurrentVolume() {
    return this.currentVolume;
  }

  get PreviousVolume() {
    return this.previousVolume;
  }

  get AlarmVolume() {
    return this.alarm.volume;
  }

  set CurrentVolume(value) {
    this.currentVolume = value;
  }

  set PreviousVolume(value) {
    this.previousVolume = value;
  }

  set AlarmVolume(value) {
    this.alarm.volume = value;
  }
}
