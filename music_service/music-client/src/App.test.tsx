import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test ('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders home page', () => {
  render(<App />);
  const homeElement = screen.getByText(/home/i);
  expect(homeElement).toBeInTheDocument();
});

test('renders login page', () => {
  render(<App />);
  const loginElement = screen.getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});

test('renders upload page', () => {
  render(<App />);
  const uploadElement = screen.getByText(/upload/i);
  expect(uploadElement).toBeInTheDocument();
});
