import { DefTimes, Element } from './common';

export class LocalStorageService {
  static storage = {
    isUsing: false,
  };

  static SaveMinutes = () => {
    const { pomoMins, shortMins, longMins } = Element;

    localStorage.setItem('pomo', pomoMins.innerText);
    localStorage.setItem('short', shortMins.innerText);
    localStorage.setItem('long', longMins.innerText);

    DefTimes.pomo = localStorage.getItem('pomo');
    DefTimes.short = localStorage.getItem('short');
    DefTimes.long = localStorage.getItem('long');
  };

  static InitializeTimeValues = () => {
    const mins = document.getElementById('minutes');

    if (!localStorage.getItem('pomo')) {
      localStorage.setItem('pomo', DefTimes.pomo);
      localStorage.setItem('short', DefTimes.short);
      localStorage.setItem('long', DefTimes.long);
    } else {
      DefTimes.pomo = localStorage.getItem('pomo');
      DefTimes.short = localStorage.getItem('short');
      DefTimes.long = localStorage.getItem('long');
    }

    // Main clock
    mins.innerText = localStorage.getItem('pomo');

    // Settings Modal
    Element.pomoMins.innerText = localStorage.getItem('pomo');
    Element.shortMins.innerText = localStorage.getItem('short');
    Element.longMins.innerText = localStorage.getItem('long');

    console.log('Pomo: ', DefTimes.pomo);
    console.log('Short: ', DefTimes.short);
    console.log('Long: ', DefTimes.long);
  };

  static storageAvailable = (type) => {
    var storage;
    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  };
}
