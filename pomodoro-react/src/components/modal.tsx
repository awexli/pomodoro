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
  colorScheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  headerText?: string;
  secondaryButton?: React.ReactElement;
  body: React.ReactElement;
  colorScheme: string;
}) => {
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        {headerText && (
          <ModalHeader data-testid="modal-header">{headerText}</ModalHeader>
        )}
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <ButtonGroup>
            {secondaryButton ? secondaryButton : null}
            <Button
              colorScheme={colorScheme}
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
