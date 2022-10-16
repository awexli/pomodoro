import { Box, Flex } from '@chakra-ui/react';
import { getRenderedTime } from './utils';

export const Clock: React.FC<{ currentTime: number }> = (props) => {
  const { currentTime } = props;
  const minutes = getRenderedTime(Math.floor(currentTime / 60));
  const seconds = getRenderedTime(currentTime % 60);

  return (
    <>
      <Flex justifyContent="center" data-testid="clock">
        <Box width={36} textAlign="right" data-testid="clock-minutes">
          {minutes}
        </Box>
        <Box paddingLeft="4px" paddingRight="4px">
          :
        </Box>
        <Box width={36} textAlign="left" data-testid="clock-seconds">
          {seconds}
        </Box>
      </Flex>
    </>
  );
};
