import { Box, Flex } from '@chakra-ui/react';

const getRenderedTime = (time: number) => {
  return time < 10 ? '0' + time : `${time}`;
};

export const Clock: React.FC<{ currentTime: number }> = (props) => {
  const { currentTime } = props;
  const minutes = getRenderedTime(Math.floor(currentTime / 60));
  const seconds = getRenderedTime(currentTime % 60);

  return (
    <>
      <Flex justifyContent="center">
        <Box width={36} textAlign="right">
          {minutes}
        </Box>
        <Box paddingLeft="4px" paddingRight="4px">
          :
        </Box>
        <Box width={36} textAlign="left">
          {seconds}
        </Box>
      </Flex>
    </>
  );
};
