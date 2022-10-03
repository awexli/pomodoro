import * as React from 'react';
import {
  Button,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ButtonGroup,
} from '@chakra-ui/react';

export const Modal = ({
  isOpen,
  onClose,
  headerText,
  secondaryButton,
  body,
}: {
  isOpen: boolean;
  onClose: () => void;
  headerText?: string;
  secondaryButton?: React.ReactElement;
  body: React.ReactElement;
}) => {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="lg">
      <ModalOverlay />
      <ModalContent>
        {headerText && <ModalHeader>{headerText}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <ButtonGroup>
            {secondaryButton ? secondaryButton : null}
            <Button colorScheme="green" variant="outline" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
