import { Modal } from './modules/modal';
import { Setting } from './modules/settings';
import { AudioService } from './modules/audio-service';
import { Timer } from './modules/timer';
import { Thread } from './modules/thread';
import { DefTimes, Clock } from './modules/common';

function init() {
  const modalInfoElement = document.getElementById('modal-info');
  const modalSettingElement = document.getElementById('modal-settings');
  const ModalInfo = new Modal(modalInfoElement);
  const ModalSettings = new Modal(modalSettingElement);

  const alarmAudioUrl = require('./assets/complete.mp3');
  const Alarm = new Audio(alarmAudioUrl);
  const CompleteAudio = new AudioService(0.5, 0.5, 50, Alarm);

  document.addEventListener('click', (e) => {
    if (e.target.parentElement) {
      switch (e.target.id || e.target.parentElement.id) {
        case 'start':
          Timer.Start();
          break;
        case 'stop':
          Timer.Stop();
          break;
        case 'reset':
          Thread.Reset();
          break;
        case 'loop':
          Thread.Loop();
          break;
        case 'pomo':
          Timer.Reset(true, DefTimes.pomo);
          break;
        case 'short':
          Timer.Reset(true, DefTimes.short);
          break;
        case 'long':
          Timer.Reset(true, DefTimes.long);
          break;
        case 'for-info':
          ModalInfo.openModal();
          break;
        case 'for-settings':
          ModalSettings.openModal();
          Setting.ListenToAdjustButtons();
          Setting.ListenToAdustVolume(CompleteAudio);
          break;
        default:
          break;
      }
    }

    if (e.target.className.includes('increment')) {
      Setting.AdjustMinutes(e, true);
    }

    if (e.target.className.includes('decrement')) {
      Setting.AdjustMinutes(e, false);
    }

    if (e.target.className.includes('delete')) {
      ModalInfo.closeModal();
      ModalSettings.closeModal();
    }

    if (e.target.className.includes('modal-background')) {
      ModalInfo.closeModal();
      ModalSettings.closeModal();
    }

    if (e.target.className.includes('is-success')) {
      Setting.SaveAdjustMinutes();
      Setting.SaveVolumeChanges(CompleteAudio);
      Timer.Reset(false, DefTimes.pomo);
      ModalSettings.closeModal();
    }

    if (e.target.className.includes('cancel')) {
      Setting.RevertAdjustMinutes();
      Setting.RevertVolumeChanges(CompleteAudio);
      ModalSettings.closeModal();
    }
  });

  window.setInterval(() => {
    if (Clock.hasStarted && !Clock.hasEnded) {
      Timer.Tick(CompleteAudio);
    }
  }, 1000);
}

/**
 * The load event fires at the end of the document loading process.
 * At this point, all of the objects in the document are in the DOM,
 * and all the images, scripts, links and sub-frames have finished loading.
 */
window.onload = init();
