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
  Spinner,
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
// TODO: time >= 60s * 1 && <= 60s * 60;
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
  const [startingTime, setStartingTime] = useState(POMODORO);
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
      stopInterval.current = setSelfAdjustingInterval(handleTime, 1000);
    }

    return () => {
      clearInterval(stopInterval.current);
      if (stopAlarmInterval.current) clearInterval(stopAlarmInterval.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStart]);

  const loadTime = (withReset = true) => {
    if (localStorage.getItem('pomodoro')) {
      const pomodoroStorage: {
        pomo: Time;
        short: Time;
        long: Time;
      } = JSON.parse(localStorage.getItem('pomodoro'));

      setPomo(pomodoroStorage.pomo);
      setShort(pomodoroStorage.short);
      setLong(pomodoroStorage.long);

      if (withReset) {
        handleResetTimer(pomodoroStorage.pomo.time * 60, pomodoroStorage.pomo.id)();
      }
    } else {
      setPomo(POMODORO);
      setShort(SHORT);
      setLong(LONG);
    }
  };

  const handleTime = (ticks: number) => {
    console.log('tick', ticks);
    if (runningTime.current > 0) {
      runningTime.current -= ticks;
    }

    if (runningTime.current === 0) {
      if (stopInterval.current) {
        stopInterval.current();
      }

      // TODO: alarm audio (unique per time?)
      Alarm.play();

      stopAlarmInterval.current = setSelfAdjustingInterval(() => {
        Alarm.play();
      }, 3000);

      if (cycles < 3) {
        // we only count a completed cycle after each short break
        if (startingTime.id === short.id) {
          setCycles(cycles + 1);
        }
      } else {
        setCycles(0);
        handleResetTimer(long.time, long.id)();
      }
    }

    if (runningTime.current >= 0) {
      setRenderedTime(runningTime.current);
    }
  };

  const handleStartStopTimer = () => {
    if (!isStart) {
      handleStartTimer();
    } else {
      handleStopTimer();
    }
  };

  const handleStartTimer = () => {
    setIsStart(true);
    setIsStop(false);
    setIsReset(false);
  };

  const handleStopTimer = () => {
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

  // has closure
  const handleResetTimer = (newTime: number = startingTime.time, id: TimeId = startingTime.id) => {
    return () => {
      // console.log({
      //   newTime,
      //   id,
      //   runningTime: runningTime.current,
      //   startingTime: startingTime.time,
      // });

      // TODO: break early if we haven't started the countdown yet
      // if (runningTime.current === startingTime.time) {
      //   return;
      // }

      handleClearAudio();
      runningTime.current = newTime;
      setRenderedTime(newTime);
      setStartingTime({ time: newTime, id });
      setIsReset(true);
      setIsStart(false);
      setIsStop(false);
    };
  };

  const handleClearAudio = () => {
    if (stopAlarmInterval.current) {
      stopAlarmInterval.current();
      clearInterval(stopAlarmInterval.current);
    }
  };

  const renderTime = () => {
    const minutes = Math.floor(renderedTime / 60);
    const seconds = renderedTime % 60;

    return (
      <CircularProgress
        value={(renderedTime / startingTime.time) * 100}
        color="green.500"
        size="25rem"
        thickness="1.2px">
        <CircularProgressLabel>
          {!pomo ? (
            <Spinner />
          ) : (
            <>
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
            </>
          )}
        </CircularProgressLabel>
      </CircularProgress>
    );
  };

  return (
    <Box style={{ height: '100vh' }} bgGradient="linear(to-br, green.300, green.50)">
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        style={{ height: '85vh' }}>
        <Box>{renderTime()}</Box>
        <ButtonGroup>
          <Button onClick={handleResetTimer()} boxShadow="base" title="Reset" aria-label="Reset">
            <RepeatClockIcon />
          </Button>
          {renderedTime === 0 ? (
            <Button
              onClick={() => {
                if (stopAlarmInterval.current) {
                  stopAlarmInterval.current();
                  clearInterval(stopAlarmInterval.current);
                }

                handleResetTimer(
                  startingTime.id === pomo.id
                    ? short.time
                    : startingTime.id === short.id
                    ? pomo.time
                    : pomo.time,
                  startingTime.id === pomo.id
                    ? short.id
                    : startingTime.id === short.id
                    ? pomo.id
                    : pomo.id
                )();
              }}
              colorScheme="green"
              boxShadow={'base'}
              title={'Okay'}
              aria-label={'Okay'}>
              <CheckIcon />
            </Button>
          ) : (
            <Button
              onClick={handleStartStopTimer}
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
          loadTime(false);
          setIsSettingsInfoModalOpen(false);
        }}
        headerText="Settings"
        secondaryButton={
          <Button
            // TODO: move this out to a handler
            onClick={() => {
              handleResetTimer(pomo.time * 60, pomo.id)();
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

              // TODO: reset cycle?
              //setIsSettingsInfoModalOpen(false);
            }}
            variant="solid"
            colorScheme="green"
            type="submit">
            Save
          </Button>
        }
        body={
          <Flex justifyContent="center" flexDirection="column">
            <p>Customize the times that works for you</p>
            <br />
            <>
              {TimeInput(pomo, (_, time) => {
                setPomo({ ...pomo, time });
              })}
              {TimeInput(short, (_, time) => {
                setShort({ ...short, time });
              })}
              {TimeInput(long, (_, time) => {
                setLong({ ...long, time });
              })}
            </>
          </Flex>
        }
      />
    </Box>
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
