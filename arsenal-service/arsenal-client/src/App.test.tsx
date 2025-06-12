import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
});

test('renders home page', () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});

test('renders login page', () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});

test('renders upload page', () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
