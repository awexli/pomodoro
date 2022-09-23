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
import type { UseCounterProps } from '@chakra-ui/react';
import { ExternalLinkIcon, SettingsIcon, RepeatClockIcon, TriangleUpIcon } from '@chakra-ui/icons';

import { Modal } from './modal';

enum TimeId {
  'DEFAULT' = 'Work time',
  'SHORT' = 'Short break',
  'LONG' = 'Long break',
}
// TODO: time >= 60s * 1 && <= 60s * 60;
const POMODORO = { time: 5, id: TimeId.DEFAULT };
const SHORT = { time: 3, id: TimeId.SHORT };
const LONG = { time: 6, id: TimeId.LONG };

function App() {
  const [pomo, setPomo] = useState(POMODORO);
  const [short, setShort] = useState(SHORT);
  const [long, setLong] = useState(LONG);
  const [renderedTime, setCurrentTime] = useState(POMODORO.time);
  const [isStart, setIsStart] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsInfoModalOpen] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [startingTime, setStartingTime] = useState(POMODORO);
  const stopInterval = useRef(null);
  const runningTime = useRef(POMODORO.time);

  useEffect(() => {
    if (isStart && runningTime.current === 0) {
      return;
    }

    if (isStart) {
      console.log('interval start');
      stopInterval.current = setSelfAdjustingInterval(handleTime, 1000);
    }

    return () => {
      console.log('unmount');
      clearInterval(stopInterval.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStart]);

  const handleTime = (ticks: number) => {
    if (runningTime.current > 0) {
      runningTime.current -= ticks;
    }

    if (runningTime.current === 0) {
      // TODO: alarm audio (unique per time?)

      if (cycles < 3) {
        // we only count a completed cycle after each short break
        if (startingTime.id === short.id) {
          setCycles(cycles + 1);
        }

        // TODO: wait x seconds before resetting time?
        handleResetTimer(
          startingTime.id === pomo.id
            ? short.time
            : startingTime.id === short.id
            ? pomo.time
            : pomo.time,
          startingTime.id === pomo.id ? short.id : startingTime.id === short.id ? pomo.id : pomo.id
        )();
      } else {
        setCycles(0);
        handleResetTimer(long.time, long.id)();
      }
    }

    if (runningTime.current >= 0) {
      setCurrentTime(runningTime.current);
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
      console.log({
        newTime,
        id,
        runningTime: runningTime.current,
        startingTime: startingTime.time,
      });

      if (stopInterval.current) {
        stopInterval.current();
      }

      // TODO: break early if we haven't started the countdown yet
      // if (runningTime.current === startingTime.time) {
      //   return;
      // }

      runningTime.current = newTime;
      setCurrentTime(newTime);
      setStartingTime({ time: newTime, id });
      setIsReset(true);
      setIsStart(false);
      setIsStop(false);
    };
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
        onClose={() => setIsSettingsInfoModalOpen(false)}
        headerText="Settings"
        secondaryButton={
          <Button
            // TODO: move this out to a handler
            onClick={() => {
              handleResetTimer(pomo.time, pomo.id)();
              // TODO: save to localstorage
              // TODO: toast for success
              setIsSettingsInfoModalOpen(false);
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
      <FormLabel>{time.id}</FormLabel>
      <NumberInput max={60} min={0} onChange={onChange} value={time.time}>
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
