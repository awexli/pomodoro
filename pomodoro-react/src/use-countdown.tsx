import * as React from 'react';
import setSelfAdjustingInterval from 'self-adjusting-interval';
const completeAlarm = require('./complete.mp3');
const alarm = typeof Audio !== 'undefined' && new Audio(completeAlarm);

export const useCountdown = ({
  isStarted,
  startingTime,
  onTick,
  onComplete,
}: {
  isStarted: boolean;
  startingTime: number;
  onTick: (time: number) => void;
  onComplete: (time: number) => void;
}): {
  stopCountdownInterval: () => void;
  stopAlarmInterval: () => void;
  runningTime: number;
  setRunningTime: (newTime: number) => void;
} => {
  const stopCountdownInterval = React.useRef(null);
  const stopAlarmInterval = React.useRef(null);
  const runningTime = React.useRef(startingTime);

  React.useEffect(() => {
    if (isStarted && runningTime.current <= 0) {
      runningTime.current = 0;
      onTick(0);
      return;
    }

    if (isStarted) {
      stopCountdownInterval.current = setSelfAdjustingInterval(
        (ticks: number) => {
          if (runningTime.current > 0) {
            runningTime.current -= ticks;

            // ticks can be greater than 1
            // to avoid negative a running time, we normalize it to be 0
            if (runningTime.current <= 0) {
              runningTime.current = 0;
            }

            onTick(runningTime.current);
          }

          if (runningTime.current <= 0) {
            stopCountdownInterval.current();
            alarm.play(); // TODO: custom/unique alarms
            stopAlarmInterval.current = setSelfAdjustingInterval(() => {
              alarm.play();
            }, 3000);

            onComplete(0);
          }
        },
        1000
      );
    }

    return () => {
      clearInterval(stopCountdownInterval.current);
      clearInterval(stopAlarmInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted]);

  return {
    stopCountdownInterval: () => {
      if (stopCountdownInterval.current) stopCountdownInterval.current();
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
