import { useState } from 'react';

import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { UseCounterProps, useToast } from '@chakra-ui/react';

import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/number-input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';

import { Modal } from './modal';
import { POMODORO } from '../constants';
import { Controller } from '../controller';
import type { Settings, Time, TimeId } from '../types';
import { SettingsIcon } from '@chakra-ui/icons';

export const SettingsModal = ({
  times,
  loadTime,
  setTime,
  stopTime,
}: {
  times: Settings;
  loadTime: (isResetTime: boolean) => void;
  setTime: (newTime: number, id: TimeId) => void;
  stopTime: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPomo, setPomo] = useState<Time>(times.pomo);
  const [newShort, setShort] = useState<Time>(times.short);
  const [newLong, setLong] = useState<Time>(times.long);
  const toast = useToast();

  const handleOnSave = () => {
    Controller.saveSettings({
      pomo: newPomo,
      short: newShort,
      long: newLong,
    });
    toast({
      title: 'Settings saved',
      status: 'success',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });
    stopTime();
    setTime(newPomo.time, newPomo.id);
    setIsOpen(false);
  };

  const handleOnClose = () => {
    loadTime(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        boxShadow="base"
        title="Settings"
        aria-label="Settings"
      >
        <SettingsIcon />
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleOnClose}
        headerText="Settings"
        secondaryButton={
          <Button
            onClick={handleOnSave}
            variant="solid"
            colorScheme="green"
            type="submit"
          >
            Save
          </Button>
        }
        body={
          <Flex justifyContent="center" flexDirection="column">
            <p>Set your preferred times (minutes):</p>
            <br />
            <Flex columnGap="1rem">
              {TimeInput(newPomo, (_, time) => {
                setPomo({ ...newPomo, time });
              })}
              {TimeInput(newShort, (_, time) => {
                setShort({ ...newShort, time });
              })}
              {TimeInput(newLong, (_, time) => {
                setLong({ ...newLong, time });
              })}
            </Flex>
          </Flex>
        }
      />
    </>
  );
};

const TimeInput = (time = POMODORO, onChange: UseCounterProps['onChange']) => {
  return (
    <FormControl marginBottom={4}>
      <FormLabel>{time.id}</FormLabel>
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
};