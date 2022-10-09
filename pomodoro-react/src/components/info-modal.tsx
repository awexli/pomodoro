import { useState } from 'react';

import { Button } from '@chakra-ui/button';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Flex, Link } from '@chakra-ui/layout';

import { Modal } from './modal';

export const InfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        marginTop={4}
        variant="link"
        color="green.600"
        textDecoration="underline"
      >
        What is this?
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerText="Info"
        body={
          <>
            <Box as="section" padding="1rem">
              <p>
                The Pomodoro Technique is a time management method that uses a
                timer to break down work into intervals, traditionally 25
                minutes in length, separated by short breaks.
              </p>
              <br />
              <Flex justifyContent="center" alignItems="center">
                <ol>
                  <li>Choose a task</li>
                  <li>Set the "work" timer to 25 minutes</li>
                  <li>Work on the task until the time rings</li>
                  <li>Take a short break (Start with 5 minutes)</li>
                  <li>Every 4 cycles ("work cycle"), take a longer break</li>
                </ol>
              </Flex>
            </Box>
            <hr />
            <Flex margin={4} justifyContent="center">
              <Link
                href="https://github.com/awexli/pomodoro"
                target="_blank"
                rel="noopener noreferrer"
                isExternal
                color="green.600"
                fontWeight="bold"
              >
                Source Code <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
          </>
        }
      />
    </>
  );
};
