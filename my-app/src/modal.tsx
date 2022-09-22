import * as React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Link,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Progress,
} from '@chakra-ui/react';

export const Modal = ({
  isOpen,
  onClose,
  body,
}: {
  isOpen: boolean;
  onClose: () => void;
  body: React.ReactElement;
}) => {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
