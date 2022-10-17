import {
  CheckIcon,
  RepeatClockIcon,
  // SettingsIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';

import { Controls } from './controls';
import type { ModifiedButtonProps } from '../types';

type ButtonHandler = () => void;

export const ControlsButtons: React.FC<{
  onReset: ButtonHandler;
  onStart: ButtonHandler;
  onStop: ButtonHandler;
  onOkay: ButtonHandler;
  // onSettings: ButtonHandler;
  currentTime: number;
  isStartPressed: boolean;
  colorScheme: string
}> = ({
  onReset,
  onStart,
  onStop,
  onOkay,
  // onSettings,
  currentTime,
  isStartPressed,
  colorScheme
}) => {
  const resetButton = ({
    onClick,
  }: {
    onClick: ButtonHandler;
  }): ModifiedButtonProps => {
    return {
      onClick,
      boxShadow: 'base',
      title: 'Reset',
      'aria-label': 'Reset',
      icon: <RepeatClockIcon />,
    };
  };

  const startButton = ({
    onClick,
  }: {
    onClick: ButtonHandler;
  }): ModifiedButtonProps => {
    return {
      onClick,
      boxShadow: 'base',
      title: 'Start',
      'aria-label': 'Start',
      width: '96px',
      icon: <TriangleUpIcon transform="rotate(90deg)" />,
    };
  };

  const stopButton = ({
    onClick,
    isStartPressed,
  }: {
    onClick: ButtonHandler;
    isStartPressed: boolean;
  }): ModifiedButtonProps => {
    return {
      onClick,
      boxShadow: isStartPressed ? 'inner' : 'base',
      title: 'Stop',
      'aria-label': 'Stop',
      width: '96px',
      icon: (
        <Box
          as="span"
          fontWeight="bolder"
          fontSize="16px"
          width="16px"
          height="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          ||
        </Box>
      ),
    };
  };

  const okayButton = ({
    onClick,
  }: {
    onClick: ButtonHandler;
  }): ModifiedButtonProps => {
    return {
      onClick,
      boxShadow: 'base',
      title: 'Okay',
      'aria-label': 'Okay',
      colorScheme,
      width: '96px',
      icon: <CheckIcon />,
    };
  };

  // const settingsButton = ({
  //   onClick,
  // }: {
  //   onClick: ButtonHandler;
  // }): ModifiedButtonProps => {
  //   return {
  //     onClick,
  //     boxShadow: 'base',
  //     title: 'Settings',
  //     'aria-label': 'Settings',
  //     icon: <SettingsIcon />,
  //   };
  // };

  return (
    <Controls
      buttons={[
        resetButton({ onClick: onReset }),
        currentTime === 0
          ? okayButton({ onClick: onOkay })
          : isStartPressed
          ? stopButton({ onClick: onStop, isStartPressed })
          : startButton({ onClick: onStart }),
        // settingsButton({ onClick: onSettings }),
      ]}
    />
  );
};
