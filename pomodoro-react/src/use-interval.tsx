import * as React from 'react';
import setSelfAdjustingInterval from 'self-adjusting-interval';
const Alarm = new Audio(require('./complete.mp3'));

export const useTime = ({
  isStartPressed,
  startingTime,
  onTick,
  onComplete,
}: {
  isStartPressed: boolean;
  startingTime: number;
  onTick: (time: number) => void;
  onComplete: (time: number) => void;
}): {
  stopInterval: () => void;
  stopAlarmInterval: () => void;
  runningTime: number;
  setRunningTime: (newTime: number) => void;
} => {
  const stopInterval = React.useRef(null);
  const stopAlarmInterval = React.useRef(null);
  const runningTime = React.useRef(startingTime);

  React.useEffect(() => {
    if (isStartPressed && runningTime.current === 0) {
      return;
    }

    if (isStartPressed) {
      stopInterval.current = setSelfAdjustingInterval((ticks: number) => {
        if (runningTime.current > 0) {
          runningTime.current -= ticks;
          onTick(runningTime.current <= 0 ? 0 : runningTime.current);
        }

        if (runningTime.current <= 0) {
          stopInterval.current();

          // TODO: alarm audio (unique per time?)
          Alarm.play();
          stopAlarmInterval.current = setSelfAdjustingInterval(() => {
            Alarm.play();
          }, 3000);

          onComplete(0);
        }
      }, 1000);
    }

    return () => {
      clearInterval(stopInterval.current);
      clearInterval(stopAlarmInterval.current);
    };
  }, [isStartPressed]);

  return {
    stopInterval: () => {
      if (stopInterval.current) stopInterval.current();
    },
    stopAlarmInterval: () => {
      if (stopAlarmInterval.current) stopAlarmInterval.current();
    },
    runningTime: runningTime.current,
    setRunningTime: (newTime: number) => {
      runningTime.current = newTime;
    },
  };
};
