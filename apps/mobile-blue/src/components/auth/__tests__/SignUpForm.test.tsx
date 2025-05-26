import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { SignUpForm } from '../SignUpForm';
import { Language } from 'shared/src/types/user.types';

// Mock the useTranslation hook
jest.mock('shared/src/hooks/useTranslation', () => ({
  useTranslation: (lang: Language) => ({
    t: {
      signUp: 'Sign Up',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email (Optional)',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account? Login',
      loading: 'Loading...',
      error: 'Something went wrong',
    },
    currentLanguage: lang,
  }),
}));

describe('SignUpForm Component', () => {
  const mockOnSignUp = jest.fn();
  const mockOnSwitchToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    expect(screen.getByTestId('name-input')).toBeTruthy();
    expect(screen.getByTestId('phone-input')).toBeTruthy();
    expect(screen.getByTestId('email-input')).toBeTruthy();
    expect(screen.getByTestId('signup-button')).toBeTruthy();
  });

  test('displays form labels in correct language', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('Phone Number')).toBeTruthy();
    expect(screen.getByText('Email (Optional)')).toBeTruthy();
  });

  test('validates required fields', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeTruthy();
      expect(screen.getByText('Phone number is required')).toBeTruthy();
    });
  });

  test('validates phone number format', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    const phoneInput = screen.getByTestId('phone-input');
    fireEvent.changeText(phoneInput, '123');
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid 10-digit phone number')).toBeTruthy();
    });
  });

  test('calls onSignUp with correct data when form is valid', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    const nameInput = screen.getByTestId('name-input');
    const phoneInput = screen.getByTestId('phone-input');
    const emailInput = screen.getByTestId('email-input');
    
    fireEvent.changeText(nameInput, 'Ravi Kumar');
    fireEvent.changeText(phoneInput, '9876543210');
    fireEvent.changeText(emailInput, 'ravi@example.com');
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(mockOnSignUp).toHaveBeenCalledWith({
        name: 'Ravi Kumar',
        phone: '9876543210',
        email: 'ravi@example.com',
        preferredLanguage: Language.ENGLISH,
      });
    });
  });

  test('allows signup without email', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    const nameInput = screen.getByTestId('name-input');
    const phoneInput = screen.getByTestId('phone-input');
    
    fireEvent.changeText(nameInput, 'Raj Singh');
    fireEvent.changeText(phoneInput, '9123456789');
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(mockOnSignUp).toHaveBeenCalledWith({
        name: 'Raj Singh',
        phone: '9123456789',
        email: undefined,
        preferredLanguage: Language.ENGLISH,
      });
    });
  });

  test('shows loading state during submission', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Loading...')).toBeTruthy();
    expect(screen.getByTestId('signup-button')).toBeDisabled();
  });

  test('displays error message when provided', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
        error="Phone number already exists"
      />
    );
    
    expect(screen.getByText('Phone number already exists')).toBeTruthy();
  });

  test('calls onSwitchToLogin when login link is pressed', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    const loginLink = screen.getByTestId('login-link');
    fireEvent.press(loginLink);
    
    expect(mockOnSwitchToLogin).toHaveBeenCalled();
  });

  test('has proper accessibility labels', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        language={Language.ENGLISH}
      />
    );
    
    expect(screen.getByLabelText('Enter your full name')).toBeTruthy();
    expect(screen.getByLabelText('Enter your phone number')).toBeTruthy();
    expect(screen.getByLabelText('Enter your email address (optional)')).toBeTruthy();
  });
}); 