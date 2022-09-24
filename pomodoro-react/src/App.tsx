import { useRef, useState, useEffect } from 'react';
import setSelfAdjustingInterval from 'self-adjusting-interval';

import {
  Box,
  Button,
  ButtonGroup,
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
import {
  ExternalLinkIcon,
  SettingsIcon,
  RepeatClockIcon,
  TriangleUpIcon,
  CheckIcon,
} from '@chakra-ui/icons';

import { Modal } from './modal';

enum TimeId {
  'DEFAULT' = 'Work time',
  'SHORT' = 'Short break',
  'LONG' = 'Long break',
}

type Time = { time: number; id: TimeId };

const Alarm = new Audio(require('./complete.mp3'));
const POMODORO = { time: 5, id: TimeId.DEFAULT };
const SHORT = { time: 3, id: TimeId.SHORT };
const LONG = { time: 6, id: TimeId.LONG };

function App() {
  const [pomo, setPomo] = useState<Time>(POMODORO);
  const [short, setShort] = useState<Time>(SHORT);
  const [long, setLong] = useState<Time>(LONG);
  const [renderedTime, setRenderedTime] = useState(POMODORO.time);
  const [isStart, setIsStart] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsInfoModalOpen] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [startingTime, setStartingTime] = useState<Time>(POMODORO);
  const toast = useToast();
  const stopInterval = useRef(null);
  const stopAlarmInterval = useRef(null);
  const runningTime = useRef(POMODORO.time);

  useEffect(() => {
    loadTime();
  }, []);

  useEffect(() => {
    if (isStart && runningTime.current === 0) {
      return;
    }

    if (isStart) {
      stopInterval.current = setSelfAdjustingInterval((ticks: number) => {
        console.log('tick', ticks);
        if (runningTime.current > 0) {
          runningTime.current -= ticks;
        }

        if (runningTime.current === 0) {
          stopInterval.current();

          // TODO: alarm audio (unique per time?)
          Alarm.play();
          stopAlarmInterval.current = setSelfAdjustingInterval(() => {
            Alarm.play();
          }, 3000);

          // we only count a completed cycle after each short break
          if (cycles < 3 && startingTime.id === short.id) {
            setCycles(cycles + 1);
          } else if (cycles >= 3) {
            setCycles(0);
          }
        }

        setRenderedTime(runningTime.current);
      }, 1000);
    }

    return () => {
      clearInterval(stopInterval.current);
      if (stopAlarmInterval.current) clearInterval(stopAlarmInterval.current);
    };
  }, [isStart]);

  const loadTime = (isResetTime = true) => {
    if (localStorage.getItem('pomodoro')) {
      const pomodoroStorage: {
        pomo: Time;
        short: Time;
        long: Time;
      } = JSON.parse(localStorage.getItem('pomodoro'));

      setPomo(pomodoroStorage.pomo);
      setShort(pomodoroStorage.short);
      setLong(pomodoroStorage.long);

      if (isResetTime) {
        resetTime(pomodoroStorage.pomo.time, pomodoroStorage.pomo.id);
      }
    } else {
      setPomo(POMODORO);
      setShort(SHORT);
      setLong(LONG);
    }
  };

  const startTime = () => {
    setIsStart(true);
    setIsStop(false);
    setIsReset(false);
  };

  const stopTime = () => {
    // avoid setting state unnecessarily
    if (!isStart && renderedTime === 0) {
      return;
    }

    if (stopInterval.current) {
      stopInterval.current();
    }

    setIsStop(true);
    setIsStart(false);
    setIsReset(false);
  };

  const resetTime = (newTime: number, id: TimeId) => {
    const newTimeInMinutes = newTime * 60;

    clearAudio();
    runningTime.current = newTimeInMinutes;
    setRenderedTime(newTimeInMinutes);
    setStartingTime({ time: newTimeInMinutes, id });
    setIsReset(true);
    setIsStart(false);
    setIsStop(false);
  };

  const clearAudio = () => {
    if (stopAlarmInterval.current) {
      stopAlarmInterval.current();
      clearInterval(stopAlarmInterval.current);
    }
  };

  const handleStartStopTime = () => {
    if (!isStart) {
      startTime();
    } else {
      stopTime();
    }
  };

  const handleResetButtonClick = () => {
    const newTime =
      startingTime.id === pomo.id ? pomo : startingTime.id === short.id ? short : long;
    resetTime(newTime.time, newTime.id);
    stopTime();
  };

  const handleOkayButtonClick = () => {
    clearAudio();

    if (cycles < 3) {
      const newTime = startingTime.id === pomo.id ? short : pomo;
      resetTime(newTime.time, newTime.id);
    } else {
      resetTime(long.time, long.id);
    }
  };

  const handleSaveButtonClick = () => {
    resetTime(pomo.time, pomo.id);
    stopTime();

    localStorage.setItem(
      'pomodoro',
      JSON.stringify({
        pomo,
        short,
        long,
      })
    );

    toast({
      title: 'Settings saved',
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });

    // TODO: to close or not to close on save
  };

  return (
    <Box style={{ height: '100vh' }} bgGradient="linear(to-br, green.300, green.50)">
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        style={{ height: '85vh' }}>
        <Box>{RenderTime(renderedTime, startingTime, cycles)}</Box>
        <ButtonGroup>
          <Button
            onClick={handleResetButtonClick}
            boxShadow="base"
            title="Reset"
            aria-label="Reset">
            <RepeatClockIcon />
          </Button>
          {renderedTime === 0 ? (
            <Button
              onClick={handleOkayButtonClick}
              colorScheme="green"
              boxShadow={'base'}
              title={'Okay'}
              aria-label={'Okay'}>
              <CheckIcon />
            </Button>
          ) : (
            <Button
              onClick={handleStartStopTime}
              isDisabled={renderedTime === 0}
              boxShadow={isStart ? 'inner' : 'base'}
              title={isStart ? 'Stop' : 'Start'}
              aria-label={isStart ? 'Stop' : 'Start'}>
              {isStart ? (
                <Box
                  as="span"
                  fontWeight="bolder"
                  fontSize="16px"
                  width="16px"
                  height="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  ||
                </Box>
              ) : (
                <TriangleUpIcon transform="rotate(90deg)" />
              )}
            </Button>
          )}
          <Button
            onClick={() => setIsSettingsInfoModalOpen(true)}
            boxShadow={isSettingsModalOpen ? 'inner' : 'base'}
            title="Settings"
            aria-label="Settings">
            <SettingsIcon />
          </Button>
        </ButtonGroup>
        <Button
          onClick={() => setIsInfoModalOpen(true)}
          marginTop={4}
          variant="link"
          color="green.600"
          textDecoration="underline">
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
          <Button onClick={handleSaveButtonClick} variant="solid" colorScheme="green" type="submit">
            Save
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
    </Box>
  );
}

function RenderTime(renderedTime: number, startingTime: Time, cycles: number) {
  const minutes = Math.floor(renderedTime / 60);
  const seconds = renderedTime % 60;

  return (
    <CircularProgress
      value={(renderedTime / startingTime.time) * 100}
      color="green.500"
      size="25rem"
      thickness="1.2px">
      <CircularProgressLabel>
        <Flex justifyContent="center">
          <Box width={36} textAlign="right">
            {minutes < 10 ? '0' + minutes : `${minutes}`}
          </Box>
          <Box paddingLeft="4px" paddingRight="4px">
            :
          </Box>
          <Box width={36} textAlign="left">
            {seconds < 10 ? '0' + seconds : `${seconds}`}
          </Box>
        </Flex>
        <Box fontSize="1rem" fontWeight="bold">
          {startingTime.id === TimeId.DEFAULT
            ? `WORK x${cycles + 1}`
            : startingTime.id === TimeId.SHORT
            ? 'SHORT BREAK'
            : 'LONG BREAK'}
        </Box>
      </CircularProgressLabel>
    </CircularProgress>
  );
}

function TimeInput(time = POMODORO, onChange: UseCounterProps['onChange']) {
  return (
    <FormControl marginBottom={4}>
      <FormLabel>{time.id} (min)</FormLabel>
      <NumberInput max={60} min={1} onChange={onChange} value={Number(time.time) ? time.time : 0}>
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
          The Pomodoro Technique is a time management method that uses a timer to break down work
          into intervals, traditionally 25 minutes in length, separated by short breaks.
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
          fontWeight="bold">
          Source Code <ExternalLinkIcon mx="2px" />
        </Link>
      </Flex>
    </>
  );
}

export default App;
