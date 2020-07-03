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

  static SaveAdjustMinutes = (time, timePrev) => {
    const pomoMins = document.getElementById('pomo-mins');
    const shortMins = document.getElementById('short-mins');
    const longMins = document.getElementById('long-mins');

    time.pomo = pomoMins.innerText;
    time.short = shortMins.innerText;
    time.long = longMins.innerText;

    timePrev.pomoSaved = time.pomo;
    timePrev.shortSaved = time.short;
    timePrev.longSaved = time.long;
  };

  static RevertAdjustMinutes = (time, timePrev) => {
    const pomoMins = document.getElementById('pomo-mins');
    const shortMins = document.getElementById('short-mins');
    const longMins = document.getElementById('long-mins');

    time.pomo = timePrev.pomoSaved;
    time.short = timePrev.shortSaved;
    time.long = timePrev.longSaved;

    pomoMins.innerText = timePrev.pomoSaved;
    shortMins.innerText = timePrev.shortSaved;
    longMins.innerText = timePrev.longSaved;
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
    const adjustVolume = document.getElementById('vol-control');
    
    adjustVolume.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      audio.CurrentVolume = parseFloat(volume);
      document.getElementById('percentage').innerText = `${
        audio.CurrentVolume * 100
      }%`;
    });
  };

  static SaveVolumeChanges = (audio) => {
    audio.AlarmVolume = audio.CurrentVolume;
    audio.PreviousVolume = audio.AlarmVolume;
    audio.PreviousValue = document.getElementById('vol-control').value;
  };

  static RevertVolumeChanges = (audio) => {
    audio.AlarmVolume = audio.PreviousVolume;
    document.getElementById('percentage').innerText = `${
      audio.PreviousVolume * 100
    }%`;
    document.getElementById('vol-control').value = audio.PreviousValue;
  };
}
