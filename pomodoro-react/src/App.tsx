import { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  Link,
  CircularProgress,
  CircularProgressLabel,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type { UseCounterProps } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { Controller } from './controller';
import { Modal } from './components/modal';
import { Clock } from './components/clock';
import type { Time } from './types';
import { TimeId } from './types';
import { useTime } from './use-interval';
import { ControlsButtons } from './components/controls-buttons';

const POMODORO = { time: 5, id: TimeId.DEFAULT };
const SHORT = { time: 3, id: TimeId.SHORT };
const LONG = { time: 6, id: TimeId.LONG };

function App() {
  const [pomo, setPomo] = useState<Time>(POMODORO);
  const [short, setShort] = useState<Time>(SHORT);
  const [long, setLong] = useState<Time>(LONG);
  const [currentTime, setCurrentTime] = useState(POMODORO.time);
  const [isStartPressed, setIsStartPressed] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsInfoModalOpen] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [startingTime, setStartingTime] = useState<Time>(POMODORO);
  const toast = useToast();

  useEffect(() => {
    loadTime();
  }, []);

  const { stopInterval, stopAlarmInterval, setRunningTime } = useTime({
    isStartPressed,
    startingTime: POMODORO.time,
    onTick: (time) => {
      setCurrentTime(time);
    },
    onComplete: () => {
      // TODO: move into handler
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
      resetTime(pomodoroStorage.pomo.time, pomodoroStorage.pomo.id);
    }
  };

  const startTime = () => {
    setIsStartPressed(true);
  };

  const stopTime = () => {
    stopInterval();
    setIsStartPressed(false);
  };

  const resetTime = (newTime: number, id: TimeId) => {
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

    resetTime(newTime.time, newTime.id);
  };

  const handleResetButtonClick = () => {
    const newTime =
      startingTime.id === pomo.id
        ? pomo
        : startingTime.id === short.id
        ? short
        : long;
    resetTime(newTime.time, newTime.id);
    stopTime();
  };

  const handleSaveButtonClick = () => {
    Controller.saveSettings({ pomo, short, long });
    stopTime();
    resetTime(pomo.time, pomo.id);
    toast({
      title: 'Settings saved',
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });
    setIsSettingsInfoModalOpen(false);
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
        <ControlsButtons
          onReset={handleResetButtonClick}
          onStart={startTime}
          onStop={stopTime}
          onOkay={handleOkayButtonClick}
          onSettings={() => setIsSettingsInfoModalOpen(true)}
          currentTime={currentTime}
          isStartPressed={isStartPressed}
        />
        <Button
          onClick={() => setIsInfoModalOpen(true)}
          marginTop={4}
          variant="link"
          color="green.600"
          textDecoration="underline"
        >
          What is this?
        </Button>
      </Flex>
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        body={InfoModalContent()}
      />
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => {
          // we are not saving anything here
          // we want to load the times from local storage, but not repaint the current times
          // the point of this is to reset the values in the TimeInput(s)
          loadTime(false);
          setIsSettingsInfoModalOpen(false);
        }}
        headerText="Settings"
        secondaryButton={
          <Button
            onClick={handleSaveButtonClick}
            variant="solid"
            colorScheme="green"
            type="submit"
          >
            Save and Close
          </Button>
        }
        body={
          <Flex justifyContent="center" flexDirection="column">
            <p>Customize the times that work best for you</p>
            <br />
            <Flex columnGap="1rem">
              {TimeInput(pomo, (_, time) => {
                setPomo({ ...pomo, time });
              })}
              {TimeInput(short, (_, time) => {
                setShort({ ...short, time });
              })}
              {TimeInput(long, (_, time) => {
                setLong({ ...long, time });
              })}
            </Flex>
          </Flex>
        }
      />
      <div>current time: {currentTime}</div>
      <div>startingTime: {startingTime.time}</div>
    </Box>
  );
}

function TimeInput(time = POMODORO, onChange: UseCounterProps['onChange']) {
  return (
    <FormControl marginBottom={4}>
      <FormLabel>{time.id} (min)</FormLabel>
      <NumberInput
        max={60}
        min={1}
        onChange={onChange}
        value={Number(time.time) ? time.time : 0}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
}

function InfoModalContent() {
  return (
    <>
      <Box as="section" padding="1rem">
        <p>
          The Pomodoro Technique is a time management method that uses a timer
          to break down work into intervals, traditionally 25 minutes in length,
          separated by short breaks.
        </p>
        <br />
        <Flex justifyContent="center" alignItems="center">
          <ol>
            <li>Choose a task</li>
            <li>Set the "work" timer to 25 minutes</li>
            <li>Work on the task until the time rings</li>
            <li>Take a short break (Start with 5 minutes)</li>
            <li>Every 4 cycles ("work cycle"), take a longer break</li>
          </ol>
        </Flex>
      </Box>
      <hr />
      <Flex margin={4} justifyContent="center">
        <Link
          href="https://github.com/awexli/pomodoro"
          target="_blank"
          rel="noopener noreferrer"
          isExternal
          color="green.600"
          fontWeight="bold"
        >
          Source Code <ExternalLinkIcon mx="2px" />
        </Link>
      </Flex>
    </>
  );
}

export default App;
