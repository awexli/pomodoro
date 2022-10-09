import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
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

test('should render a clock', () => {
  render(wrapper);
  expect(screen.getByTestId('clock')).toBeInTheDocument();
});

test('should render buttons', () => {
  render(wrapper);
  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(4);
});

test('should render default time', () => {
  render(wrapper);

  expect(screen.getByTestId('clock-minutes')).toHaveTextContent('05');
  expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
});

describe('countdown actions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should start the countdown', async () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // prevent timer from making any more ticks,
    // which stops any asynchronous state updates (i.e. onTick)
    jest.clearAllTimers();

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('59');
  });

  test('should stop the countdown', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    fireEvent.click(screen.getByTitle('Stop'));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('55');
  });

  test('should reset the countdown', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    fireEvent.click(screen.getByTitle('Stop'));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('55');

    fireEvent.click(screen.getByTitle('Reset'));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('05');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  });
});
