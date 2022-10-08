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

function App() {
  const [pomo, setPomo] = useState<Time>(POMODORO);
  const [short, setShort] = useState<Time>(SHORT);
  const [long, setLong] = useState<Time>(LONG);
  const [startingTime, setStartingTime] = useState<Time>(POMODORO);
  const [currentTime, setCurrentTime] = useState(POMODORO.time);
  const [isStartPressed, setIsStartPressed] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    loadTime();
  }, []);

  const { stopCountdownInterval, stopAlarmInterval, setRunningTime } =
    useCountdown({
      isStarted: isStartPressed,
      startingTime: pomo.time,
      onTick: (time) => {
        setCurrentTime(time);
      },
      onComplete: () => {
        if (cycles < 3 && startingTime.id === short.id) {
          setCycles(cycles + 1);
        } else if (cycles >= 3) {
          setCycles(0);
        }
      },
    });

  const loadTime = (isResetTime = true) => {
    const pomodoroStorage = Controller.loadSettings({ pomo, short, long });

    setPomo(pomodoroStorage.pomo);
    setShort(pomodoroStorage.short);
    setLong(pomodoroStorage.long);

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

    let newTime: Time;

    if (cycles < 3) {
      newTime = startingTime.id === pomo.id ? short : pomo;
    } else {
      newTime = long;
    }

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
      bgGradient="linear(to-br, green.300, green.50)"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        style={{ height: '80vh' }} // TODO: make this responsive
      >
        <CircularProgress
          value={(currentTime / startingTime.time) * 100}
          color="green.500"
          size="23rem" // TODO: make this responsive
          thickness="1px"
        >
          <CircularProgressLabel>
            <Clock currentTime={currentTime} />
            <Box fontSize="1rem" fontWeight="bold">
              {startingTime.id === TimeId.DEFAULT
                ? `WORK x${cycles + 1}`
                : startingTime.id === TimeId.SHORT
                ? 'SHORT BREAK'
                : 'LONG BREAK'}
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
          />
          <SettingsModal
            times={{ pomo, short, long }}
            loadTime={loadTime}
            setTime={setTime}
            stopTime={stopTime}
          />
        </ButtonGroup>
        <InfoModal />
      </Flex>
    </Box>
  );
}

export default App;
