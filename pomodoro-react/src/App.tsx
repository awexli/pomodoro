import { useState, useEffect } from 'react';

import {
  Box,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  ButtonGroup,
} from '@chakra-ui/react';

import { Controller } from './controller';
import { Clock } from './components/clock';
import { TimeId } from './types';
import { useCountdown } from './use-countdown';
import { ControlsButtons } from './components/controls-buttons';
import { InfoModal } from './components/info-modal';
import { SettingsModal } from './components/settings-modal';

import type { Time } from './types';
import { POMODORO, SHORT, LONG } from './constants';
import { getRenderedTime } from './components/utils';

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}

function App() {
  const [pomo, setPomo] = useState<Time>(POMODORO);
  const [short, setShort] = useState<Time>(SHORT);
  const [long, setLong] = useState<Time>(LONG);
  const [startingTime, setStartingTime] = useState<Time>(POMODORO);
  const [currentTime, setCurrentTime] = useState(POMODORO.time);
  const [isStartPressed, setIsStartPressed] = useState(false);
  const [isNotificationGranted, setIsNotificationGranted] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [color, setColor] = useState('green');

  useEffect(() => {
    const setBrowserNotification = () => {
      if (!('Notification' in window)) {
        return;
      }

      if (checkNotificationPromise()) {
        Notification.requestPermission().then((permission) => {
          setIsNotificationGranted(permission === 'granted');
        });
      } else {
        Notification.requestPermission((permission) => {
          setIsNotificationGranted(permission === 'granted');
        });
      }
    };

    loadTime();
    setBrowserNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnTick = (time: number) => {
    setCurrentTime(time);
    document.title = `${getRenderedTime(
      Math.floor(time / 60)
    )}:${getRenderedTime(time % 60)}`;
  };

  const handleOnComplete = () => {
    // the first two cycles are only completed after each short break
    if (cycles < 2 && startingTime.id === TimeId.SHORT) {
      setCycles(cycles + 1);
    }

    if (isNotificationGranted) {
      new Notification(
        `${
          startingTime.id === TimeId.WORK
            ? `${
                cycles === 2
                  ? 'Time for a long break!'
                  : 'Time for a short break!'
              }`
            : 'Time to work!'
        }`
      );
    }
  };

  const { stopCountdownInterval, stopAlarmInterval, setRunningTime } =
    useCountdown({
      isStarted: isStartPressed,
      startingTime: pomo.time,
      onTick: handleOnTick,
      onComplete: handleOnComplete,
    });

  const updateTimes = ({ pomo, short, long }) => {
    setPomo(pomo);
    setShort(short);
    setLong(long);
  };

  const loadTime = (isResetTime = true) => {
    const pomodoroStorage = Controller.loadSettings({ pomo, short, long });

    updateTimes({
      pomo: pomodoroStorage.pomo,
      short: pomodoroStorage.short,
      long: pomodoroStorage.long,
    });

    if (isResetTime) {
      setTime(pomodoroStorage.pomo.time, pomodoroStorage.pomo.id);
    }
  };

  const startTime = () => {
    setIsStartPressed(true);
  };

  const stopTime = () => {
    stopCountdownInterval();
    setIsStartPressed(false);
  };

  const setTime = (newTime: number, id: TimeId) => {
    const newTimeInMinutes = newTime * 60;
    setColor(
      id === TimeId.WORK ? 'green' : id === TimeId.SHORT ? 'blue' : 'orange'
    );
    stopAlarmInterval();
    setRunningTime(newTimeInMinutes);
    setCurrentTime(newTimeInMinutes);
    setStartingTime({ time: newTimeInMinutes, id });
    setIsStartPressed(false);
  };

  const handleOkayButtonClick = () => {
    if (currentTime > 0) {
      return;
    }

    const isReadyForLongBreak = cycles === 2 && startingTime.id === TimeId.WORK;
    const newTime = isReadyForLongBreak
      ? long
      : startingTime.id === long.id
      ? pomo
      : startingTime.id === pomo.id
      ? short
      : pomo;

    if (isReadyForLongBreak) setCycles(0);
    setTime(newTime.time, newTime.id);
  };

  const handleResetButtonClick = () => {
    const newTime =
      startingTime.id === pomo.id
        ? pomo
        : startingTime.id === short.id
        ? short
        : long;
    setTime(newTime.time, newTime.id);
    stopTime();
  };

  return (
    <Box
      style={{ height: '100vh' }}
      bgGradient={`linear(to-br, ${color}.300, ${color}.50)`}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        style={{ height: '80vh' }} // TODO: make this responsive
      >
        <CircularProgress
          value={(currentTime / startingTime.time) * 100}
          color={`${color}.500`}
          size="23rem" // TODO: make this responsive
          thickness="1px"
          data-testid="circular-progress"
        >
          <CircularProgressLabel>
            <Clock currentTime={currentTime} />
            <Box fontSize="1rem" fontWeight="bold">
              {`${startingTime.id} ${
                startingTime.id === TimeId.WORK ? `x${cycles + 1}` : ''
              }`}
            </Box>
          </CircularProgressLabel>
        </CircularProgress>
        <ButtonGroup>
          <ControlsButtons
            onReset={handleResetButtonClick}
            onOkay={handleOkayButtonClick}
            onStart={startTime}
            onStop={stopTime}
            currentTime={currentTime}
            isStartPressed={isStartPressed}
            colorScheme={color}
          />
          <SettingsModal
            times={{ pomo, short, long }}
            loadTime={loadTime}
            setTime={({ pomo, short, long }) => {
              updateTimes({ pomo, short, long });
              setTime(pomo.time, pomo.id);
            }}
            stopTime={stopTime}
            colorScheme={color}
          />
        </ButtonGroup>
        <InfoModal colorScheme={color} />
      </Flex>
    </Box>
  );
}

export default App;
