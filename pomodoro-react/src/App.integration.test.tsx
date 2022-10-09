import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';
import { Controller } from './controller';
import { TimeId } from './types';

const wrapper = (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);

let playStub;

beforeEach(() => {
  jest.useFakeTimers();
  playStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(async () => {});
  jest.spyOn(Controller, 'loadSettings').mockImplementation(() => ({
    pomo: { time: 5, id: TimeId.DEFAULT },
    short: { time: 3, id: TimeId.SHORT },
    long: { time: 5, id: TimeId.LONG },
  }));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

it('should render the correct time after starting the countdown', () => {
  render(wrapper);

  fireEvent.click(screen.getByTitle('Start'));

  act(() => jest.advanceTimersByTime(1000));

  // prevent timer from making any more ticks,
  // which stops any asynchronous state updates (i.e. onTick)
  // jest.clearAllTimers();

  expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
  expect(screen.getByTestId('clock-seconds')).toHaveTextContent('59');
});

it('should render the correct time after stopping the countdown', () => {
  render(wrapper);

  fireEvent.click(screen.getByTitle('Start'));

  act(() => jest.advanceTimersByTime(5000));

  fireEvent.click(screen.getByTitle('Stop'));

  act(() => jest.advanceTimersByTime(5000));

  expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
  expect(screen.getByTestId('clock-seconds')).toHaveTextContent('55');
});

it('should render the correct time after resetting the countdown', () => {
  render(wrapper);

  fireEvent.click(screen.getByTitle('Start'));

  act(() => jest.advanceTimersByTime(5000));

  fireEvent.click(screen.getByTitle('Stop'));

  expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
  expect(screen.getByTestId('clock-seconds')).toHaveTextContent('55');

  fireEvent.click(screen.getByTitle('Reset'));

  expect(screen.getByTestId('clock-minutes')).toHaveTextContent('05');
  expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
});

describe('countdown completes', () => {
  it('should render the correct time when the countdown completes', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => jest.advanceTimersByTime(5000 * 60));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  });

  it('should not continue the time when the countdown completes', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    // advance time greater than the current work time
    act(() => jest.advanceTimersByTime(6000 * 60));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  });

  it('should render the okay button when the countdown completes', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => jest.advanceTimersByTime(5000 * 60));

    expect(screen.getByTitle('Okay')).toBeInTheDocument();
  });

  it('should not continue the timer when the countdown completes', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => jest.advanceTimersByTime(5000 * 60));

    expect(screen.getByTitle('Okay')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  });

  it('should play an audio when the countdown completes', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => jest.advanceTimersByTime(5000 * 60));

    expect(playStub).toBeCalledTimes(1);
  });
  // should clear the audio after clicking the okay button
});

describe('cycles', () => {
  it('should start the short break time', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => jest.advanceTimersByTime(5000 * 60));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('00');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
    expect(screen.getByTitle('Okay')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Okay'));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('03');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  });

  it('should complete one cycle', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));
    act(() => jest.advanceTimersByTime(5000 * 60));
    fireEvent.click(screen.getByTitle('Okay'));

    fireEvent.click(screen.getByTitle('Start'));
    act(() => jest.advanceTimersByTime(3000 * 60));
    fireEvent.click(screen.getByTitle('Okay'));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('05');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  });

  it('should complete all cycles', () => {
    render(wrapper);

    const startAndCompleteWork = () => {
      fireEvent.click(screen.getByTitle('Start'));
      act(() => jest.advanceTimersByTime(5000 * 60));
      fireEvent.click(screen.getByTitle('Okay'));
    };

    const startAndCompleteShortBreak = () => {
      fireEvent.click(screen.getByTitle('Start'));
      act(() => jest.advanceTimersByTime(3000 * 60));
      fireEvent.click(screen.getByTitle('Okay'));
    };

    startAndCompleteWork();
    startAndCompleteShortBreak();

    startAndCompleteWork();
    startAndCompleteShortBreak();

    startAndCompleteWork();
    startAndCompleteShortBreak();

    // long break
    fireEvent.click(screen.getByTitle('Start'));
    act(() => jest.advanceTimersByTime(6000 * 60));
    fireEvent.click(screen.getByTitle('Okay'));

    // back to work x1
    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('05');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
    expect(screen.getByText(/Work x1/i)).toBeInTheDocument();
  });
});

describe('settings', () => {
  it('should continue the countdown while the settings modal is open', async () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('59');

    fireEvent.click(screen.getByTitle('Settings'));

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('58');
  });

  it('should continue the countdown after closing the settings', () => {
    render(wrapper);

    fireEvent.click(screen.getByTitle('Start'));

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('59');

    fireEvent.click(screen.getByTitle('Settings'));

    expect(screen.getByText(/Settings/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close/i));

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('04');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('58');
  });

  it('should set the new time when saving the settings', () => {
    render(wrapper);

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('05');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');

    fireEvent.click(screen.getByTitle('Settings'));

    expect(screen.getByText(/Settings/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Work time' }), {
      target: { value: 25 },
    });

    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByTestId('clock-minutes')).toHaveTextContent('25');
    expect(screen.getByTestId('clock-seconds')).toHaveTextContent('00');
  });
});
