import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the planning dashboard', () => {
  render(<App />);
  expect(screen.getByText(/4\/20_planning_west_v1/i)).toBeInTheDocument();
});

test('renders the Terminal Schedule Overview section', () => {
  render(<App />);
  expect(screen.getByText(/Terminal Schedule Overview/i)).toBeInTheDocument();
});

test('renders the Inventory Details section', () => {
  render(<App />);
  expect(screen.getByText(/Inventory Details/i)).toBeInTheDocument();
});

test('renders the Liftings vs. Forecast section', () => {
  render(<App />);
  expect(screen.getByText(/Liftings vs\. Forecast/i)).toBeInTheDocument();
});

test('renders the Historical Average section', () => {
  render(<App />);
  expect(screen.getByText(/Historical Average/i)).toBeInTheDocument();
});
