import { DefTimes, Element } from './common';
import { LocalStorageService } from './local-storage';

export class Setting {
  static AdjustMinutes = (event, isIncrement) => {
    let operation;
    let id;

    if (typeof isIncrement !== 'boolean') {
      alert('Error: isIncrement must be a boolean');
      return;
    }

    if (isIncrement) {
      id = event.target.nextElementSibling.id;
      operation = 1;
    } else {
      id = event.target.previousElementSibling.id;
      operation = -1;
    }

    return Setting.UpdateAdjustView(id, operation);
  };

  static UpdateAdjustView = (id, operation) => {
    const min = document.getElementById(id);
    const isPlus = operation === 1;
    min.innerText = isPlus
      ? parseInt(min.innerText) + 1
      : parseInt(min.innerText) - 1;
    if (min.innerText < 1) min.innerText = 60;
    if (min.innerText > 60) min.innerText = 1;
  };

  static SaveAdjustMinutes = () => {
    if (LocalStorageService.storage.isUsing) {
      LocalStorageService.SaveMinutes();
    } else {
      const { pomoMins, shortMins, longMins } = Element;

      DefTimes.pomo = pomoMins.innerText;
      DefTimes.short = shortMins.innerText;
      DefTimes.long = longMins.innerText;

      DefTimes.pomoSaved = DefTimes.pomo;
      DefTimes.shortSaved = DefTimes.short;
      DefTimes.longSaved = DefTimes.long;
    }
  };

  static RevertAdjustMinutes = () => {
    const { pomoMins, shortMins, longMins } = Element;

    DefTimes.pomo = DefTimes.pomoSaved;
    DefTimes.short = DefTimes.shortSaved;
    DefTimes.long = DefTimes.longSaved;

    pomoMins.innerText = DefTimes.pomoSaved;
    shortMins.innerText = DefTimes.shortSaved;
    longMins.innerText = DefTimes.longSaved;
  };

  static ListenToAdjustButtons = () => {
    const adjustButtons = document.querySelectorAll('.adjust-button');
    let timer = null;

    // simulate press and hold
    adjustButtons.forEach((element) =>
      element.addEventListener('mousedown', (evt) => {
        timer = setInterval(() => {
          evt.target.click();
        }, 120);
      })
    );

    adjustButtons.forEach((element) =>
      element.addEventListener('mouseup', () => {
        clearInterval(timer);
      })
    );

    // If the mouse is dragged out of the original element
    // and then the mouse is released, the timer will stop
    adjustButtons.forEach((element) =>
      element.addEventListener('mouseleave', () => {
        clearInterval(timer);
      })
    );
  };

  static ListenToAdustVolume = (audio) => {
    const adjustVolume = Element.volumeControl;

    adjustVolume.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      audio.CurrentVolume = parseFloat(volume);
      Element.percentage.innerText = `${audio.CurrentVolume * 100}%`;
    });
  };

  static SaveVolumeChanges = (audio) => {
    audio.AlarmVolume = audio.CurrentVolume;
    audio.PreviousVolume = audio.AlarmVolume;
    audio.PreviousValue = Element.volumeControl.value;
  };

  static RevertVolumeChanges = (audio) => {
    audio.AlarmVolume = audio.PreviousVolume;
    Element.percentage.innerText = `${audio.PreviousVolume * 100}%`;
    Element.volumeControl.value = audio.PreviousValue;
  };
}
