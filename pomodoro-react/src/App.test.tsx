import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import App from './App';

const wrapper = (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);

test('should render a circular progress', () => {
  render(wrapper);

  expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
});

test('should render the default time', () => {
  render(wrapper);

  expect(screen.getByTestId('clock-minutes')).toHaveTextContent('05');
  expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  expect(screen.getByText(/Work x1/i)).toBeInTheDocument();
});

test('should render buttons', () => {
  render(wrapper);

  expect(screen.getAllByRole('button')).toHaveLength(4);
});
