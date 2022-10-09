import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
  const linkElement = screen.getByText(/What is this?/i);
  expect(linkElement).toBeInTheDocument();
});
