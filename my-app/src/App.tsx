import { useRef, useState } from 'react';
import { useEffect } from 'react';
import setSelfAdjustingInterval from 'self-adjusting-interval';

import { Button, ButtonGroup } from '@chakra-ui/react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { SettingsIcon, InfoOutlineIcon, RepeatClockIcon, TriangleUpIcon } from '@chakra-ui/icons';

// Should be >= 60s * 1 && <= 60s * 60;
const DEFAULT_TIME = 60 * 1;

function App() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const [isStop, setIsStop] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stopInterval = useRef(null);
  const runningTime = useRef(time);

  useEffect(() => {
    console.log({ isStart, isStop });
    if (isStart && runningTime.current === 0) {
      return;
    }

    if (isStart) {
      // only start the timer countdown immediately on initial start
      if (time === DEFAULT_TIME) {
        runningTime.current -= 1;
        setTime(runningTime.current);
      }

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
      setIsStart(false);
      stopInterval.current();
    }

    if (runningTime.current >= 0) {
      setTime(runningTime.current);
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
    if (!isStart && time === 0) {
      return;
    }

    if (stopInterval.current) {
      stopInterval.current();
    }

    setIsStop(true);
    setIsStart(false);
    setIsReset(false);
  };

  const handleResetTimer = () => {
    if (stopInterval.current) {
      stopInterval.current();
    }

    setTime(DEFAULT_TIME);
    runningTime.current = DEFAULT_TIME;

    setIsReset(true);
    setIsStart(false);
    setIsStop(false);
  };

  const handleOnInfoOpen = () => {
    setIsModalOpen(true);
  };

  const handleOnInfoClose = () => {
    setIsModalOpen(false);
  };

  const renderTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
      <Flex justifyContent={'center'}>
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
    );
  };
  return (
    <>
      <Progress value={(time / DEFAULT_TIME) * 100} />
      <Grid placeItems={'center'}>
        <ButtonGroup marginTop={10}>
          <Button>Pomodoro</Button>
          <Button>Short Break</Button>
          <Button>Long Break</Button>
        </ButtonGroup>
        <Box marginTop={4} fontSize="7rem">
          {renderTime()}
        </Box>
        <ButtonGroup marginTop={4}>
          <Button
            onClick={handleStartStopTimer}
            isDisabled={time === 0}
            boxShadow={isStart ? 'inner' : 'base'}>
            {isStart ? (
              <span
                style={{
                  fontWeight: 'bolder',
                  fontSize: '16px',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                ||
              </span>
            ) : (
              <TriangleUpIcon transform={'rotate(90deg)'} />
            )}
          </Button>
          <Button onClick={handleResetTimer} boxShadow="base">
            <RepeatClockIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup marginTop={12}>
          <Button
            onClick={handleOnInfoOpen}
            variant="ghost"
            title="Information"
            aria-label="Information">
            <InfoOutlineIcon />
          </Button>
          <Button
            onClick={() => {
              console.log('hello');
            }}
            variant="ghost"
            title="Settings"
            aria-label="Settings">
            <SettingsIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Modal isOpen={isModalOpen} onClose={handleOnInfoClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="section" padding="1rem">
              <p>
                The Pomodoro Technique is a time management method that uses a timer to break down
                work into intervals, traditionally 25 minutes in length, separated by short breaks.{' '}
                <a
                  href="https://francescocirillo.com/pages/pomodoro-technique"
                  target="_blank"
                  rel="noopener noreferrer">
                  The core process consists of 6 steps
                </a>
              </p>
              <br />
              <p>[Pomodoro] - 25 minutes</p>
              <p>[Short Break] - 3 to 5 minutes</p>
              <p>[Long Break] - 15 to 30 minutes</p>
              <p>[Loop] - loops one entire cycle of the pomodoro technique</p>
            </Box>
            <hr />
            <Box as="section" padding="1rem">
              <Box as="ul" listStyleType="none">
                <li>
                  Work: <strong>25 minutes</strong>
                </li>
                <li>Short Break: 5 minutes</li>
                <li>
                  Work: <strong>25 minutes</strong>
                </li>
                <li>Short Break: 5 minutes</li>
                <li>
                  Work: <strong>25 minutes</strong>
                </li>
                <li>Short Break: 5 minutes</li>
                <li>
                  Work: <strong>25 minutes</strong>
                </li>
                <li>Long Break: 15 minutes</li>
              </Box>
            </Box>
            <hr />
            <Button variant="link">
              <a
                href="https://github.com/awexli/pomodoro"
                target="_blank"
                rel="noopener noreferrer">
                Source Code
              </a>
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleOnInfoClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
