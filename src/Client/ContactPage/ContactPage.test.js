import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactUs from './index';

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/test',
  }),
}));

// Mock the emailjs send method
jest.mock('emailjs-com', () => ({
  send: jest.fn().mockResolvedValue({}),
}));

describe('ContactUs', () => {
  it('renders form fields', () => {
    render(<ContactUs />);
    
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByPlaceholderText(/Enter Message/i);
    const submitButton = screen.getByText(/Submit/i);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<ContactUs />);
    
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByPlaceholderText(/Enter Message/i);
    const submitButton = screen.getByText(/Submit/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello, this is a test message.' } });

    fireEvent.click(submitButton);

    // Add assertions based on your component's behavior after submission
    // For example, check for success message or verify emailjs.send was called
  });

  // Add more tests as needed for your component's functionality
});
