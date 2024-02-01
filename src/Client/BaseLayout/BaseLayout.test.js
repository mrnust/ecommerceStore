import React from 'react';
import { render } from '@testing-library/react';
import BaseLayout from './BaseLayout';

// A simple test to check if the component renders without crashing
test('renders BaseLayout component', () => {
  render(<BaseLayout />);
});

// Test to check if the Recommendations heading is present when userStatus is LOGGED_IN
test('renders Recommendations heading when user is logged in', () => {
  // Mocking localStorage values to simulate a logged-in user
  const localStorageMock = {
    USERID: 'mockUserId',
    USERSTATUS: 'LOGGED_IN',
  };

  // Mock the implementation of localStorage.getItem
  jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => localStorageMock[key]);

  const { getByText } = render(<BaseLayout />);
  const recommendationsHeading = getByText(/RECOMMENDATIONS/i);

  // Assert that the Recommendations heading is present
  expect(recommendationsHeading).toBeInTheDocument();
});

// Test to check if the Recommendations heading is not present when userStatus is GUEST
test('does not render Recommendations heading when user is guest', () => {
  // Mocking localStorage values to simulate a guest user
  const localStorageMock = {
    USERID: 'mockUserId',
    USERSTATUS: 'GUEST',
  };

  // Mock the implementation of localStorage.getItem
  jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => localStorageMock[key]);

  const { queryByText } = render(<BaseLayout />);
  const recommendationsHeading = queryByText(/RECOMMENDATIONS/i);

  // Assert that the Recommendations heading is not present
  expect(recommendationsHeading).not.toBeInTheDocument();
});

// You can add more tests to check other aspects of your component
