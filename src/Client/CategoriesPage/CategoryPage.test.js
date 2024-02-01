import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CategoriesPage from './index'; // Assuming the test file is in the same folder

// Mock the useSpeechRecognition hook
jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: jest.fn(),
}));

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: { category: 'Test Category' },
    pathname: '/test',
  }),
}));

describe('CategoriesPage', () => {
  it('renders category header', () => {
    render(<CategoriesPage />);
    const headerElement = screen.getByText('Test Category');
    expect(headerElement).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<CategoriesPage />);
    const searchInput = screen.getByLabelText('Search by name');
    expect(searchInput).toBeInTheDocument();
  });

  it('handles search input correctly', () => {
    render(<CategoriesPage />);
    const searchInput = screen.getByLabelText('Search by name');
    userEvent.type(searchInput, 'Test Product');
    expect(searchInput.value).toBe('Test Product');
  });

  // Add more tests as needed for your component's functionality
});
