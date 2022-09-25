import { ButtonGroup, Button, ButtonProps } from '@chakra-ui/react';
import * as React from 'react';

interface ControlsProps {
  buttons: Array<ButtonProps & { icon: React.ReactNode }>;
}

export const Controls: React.FC<ControlsProps> = ({ buttons }) => {
  return (
    <ButtonGroup>
      {buttons.map((buttonProps, i) => {
        const { icon, ...props } = buttonProps;
        return <Button key={i} {...props}>{icon}</Button>;
      })}
    </ButtonGroup>
  );
};
