import { useRef, useState } from 'react';
import { useEffect } from 'react';
import setSelfAdjustingInterval from 'self-adjusting-interval';

import { Button, ButtonGroup } from '@chakra-ui/react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react';

function App() {
  const [time, setTime] = useState(1500);
  const [isStop, setIsStop] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const stopInterval = useRef(null);

  useEffect(() => {
    let runningTime = time;

    stopInterval.current = setSelfAdjustingInterval((ticks: number) => {
      if (isStart) {
        runningTime -= ticks;
        setTime(runningTime);
      }
    }, 1000);

    return () => {
      console.log('unmount');
      clearInterval(stopInterval.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStart]);

  const handleStartTimer = () => {
    setIsStart(true);
    setIsStop(false);
    setIsReset(false);
  };

  const handleStopTimer = () => {
    stopInterval.current();
    setIsStop(true);
    setIsStart(false);
    setIsReset(false);
  };

  const handleResetTimer = () => {
    stopInterval.current();
    setTime(1500);
    setIsReset(true);
    setIsStart(false);
    setIsStop(false);
  };

  const renderTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const renderMin = minutes < 10 ? '0' + minutes : `${minutes}`;
    const renderSec = seconds < 10 ? '0' + seconds : `${seconds}`;

    return (
      <Flex justifyContent={'center'}>
        <Box width={20}>{renderMin}</Box>
        <Box>:</Box>
        <Box width={20}>{renderSec}</Box>
      </Flex>
    );
  };

  return (
    <>
      <Progress value={(time / 1500) * 100} />
      <Grid placeItems={'center'}>
        {/* <ButtonGroup marginTop={4}>
        <Button>Pomodoro</Button>
        <Button>Short Break</Button>
        <Button>Long Break</Button>
      </ButtonGroup> */}

        <Box marginTop={10} fontSize="4rem">
          {renderTime()}
        </Box>
        <ButtonGroup marginTop={4}>
          <Button onClick={handleStartTimer} boxShadow={isStart ? 'inner' : 'sm'}>
            Start
          </Button>
          <Button onClick={handleStopTimer} boxShadow={isStop ? 'inner' : 'sm'}>
            Stop
          </Button>
          <Button onClick={handleResetTimer} boxShadow="sm">
            Reset
          </Button>
        </ButtonGroup>
        <ButtonGroup marginTop={10}>
          <Button variant="ghost">Info</Button>
          <Button variant="ghost">Settings</Button>
        </ButtonGroup>
      </Grid>
    </>
  );
}

export default App;
