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
      photo: 'Photo',
      photoRequired: 'Photo is required',
      photoIdentityCaption: 'Please upload your photo or take a selfie to uniquely identify you, as names can be common. This helps us ensure you are a genuine worker.',
      uploadPhoto: 'Upload Photo',
      takePhoto: 'Take Photo',
      chooseFromGallery: 'Choose from Gallery',
      retakePhoto: 'Retake Photo',
      cancel: 'Cancel',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account? Login',
      loading: 'Loading...',
      error: 'Something went wrong',
    },
    currentLanguage: lang,
  }),
}));

// Mock the LanguageChangeModal
jest.mock('../../common/LanguageChangeModal', () => ({
  LanguageChangeModal: ({ visible, onClose, onLanguageChange }: any) => {
    const { Text, TouchableOpacity, View } = require('react-native');
    return visible ? (
      <View testID="language-modal">
        <Text>Language Modal</Text>
        <TouchableOpacity
          testID="select-hindi"
          onPress={() => {
            onLanguageChange(Language.HINDI);
            onClose();
          }}
        >
          <Text>Select Hindi</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="close-modal" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  },
}));

// Mock the PhotoUpload component
jest.mock('../../common/PhotoUpload', () => ({
  PhotoUpload: ({ onPhotoSelected, error }: any) => {
    const { Text, TouchableOpacity, View } = require('react-native');
    return (
      <View testID="photo-upload">
        <Text>Photo Upload Component</Text>
        <TouchableOpacity
          testID="mock-photo-select"
          onPress={() => onPhotoSelected('mock-photo-uri')}
        >
          <Text>Select Photo</Text>
        </TouchableOpacity>
        {error && <Text testID="photo-error">{error}</Text>}
      </View>
    );
  },
}));

describe('SignUpForm Component', () => {
  const mockOnSignUp = jest.fn();
  const mockOnSwitchToLogin = jest.fn();
  const mockOnBack = jest.fn();
  const mockOnLanguageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
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
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
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
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeTruthy();
      expect(screen.getByText('Phone number is required')).toBeTruthy();
      expect(screen.getByText('Photo is required')).toBeTruthy();
    });
  });

  test('validates phone number format', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
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
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    const nameInput = screen.getByTestId('name-input');
    const phoneInput = screen.getByTestId('phone-input');
    const emailInput = screen.getByTestId('email-input');
    const photoSelectButton = screen.getByTestId('mock-photo-select');
    
    fireEvent.changeText(nameInput, 'Ravi Kumar');
    fireEvent.changeText(phoneInput, '9876543210');
    fireEvent.changeText(emailInput, 'ravi@example.com');
    fireEvent.press(photoSelectButton);
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(mockOnSignUp).toHaveBeenCalledWith({
        name: 'Ravi Kumar',
        phone: '9876543210',
        email: 'ravi@example.com',
        photo: 'mock-photo-uri',
        preferredLanguage: Language.ENGLISH,
      });
    });
  });

  test('allows signup without email', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    const nameInput = screen.getByTestId('name-input');
    const phoneInput = screen.getByTestId('phone-input');
    const photoSelectButton = screen.getByTestId('mock-photo-select');
    
    fireEvent.changeText(nameInput, 'Raj Singh');
    fireEvent.changeText(phoneInput, '9123456789');
    fireEvent.press(photoSelectButton);
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(mockOnSignUp).toHaveBeenCalledWith({
        name: 'Raj Singh',
        phone: '9123456789',
        email: undefined,
        photo: 'mock-photo-uri',
        preferredLanguage: Language.ENGLISH,
      });
    });
  });

  test('shows loading state during submission', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
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
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
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
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
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
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    expect(screen.getByLabelText('Enter your full name')).toBeTruthy();
    expect(screen.getByLabelText('Enter your phone number')).toBeTruthy();
    expect(screen.getByLabelText('Enter your email address (optional)')).toBeTruthy();
  });

  test('shows back button when onBack prop is provided', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    expect(screen.getByTestId('back-button')).toBeTruthy();
  });

  test('hides back button when onBack prop is not provided', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={undefined}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    expect(screen.queryByTestId('back-button')).toBeNull();
  });

  test('calls onBack when back button is pressed', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    const backButton = screen.getByTestId('back-button');
    fireEvent.press(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('shows language indicator with correct flag and text', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    expect(screen.getByTestId('language-change-button')).toBeTruthy();
    expect(screen.getByText('🇺🇸 EN')).toBeTruthy();
  });

  test('shows correct language indicator for Hindi', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.HINDI}
      />
    );
    expect(screen.getByText('🇮🇳 हि')).toBeTruthy();
  });

  test('shows correct language indicator for Bengali', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.BENGALI}
      />
    );
    expect(screen.getByText('🇮🇳 বা')).toBeTruthy();
  });

  test('opens language modal when language indicator is pressed', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('language-modal')).toBeNull();
    
    // Press language indicator
    const languageChangeButton = screen.getByTestId('language-change-button');
    fireEvent.press(languageChangeButton);
    
    // Modal should be visible
    await waitFor(() => {
      expect(screen.queryByTestId('language-modal')).toBeTruthy();
    });
  });

  test('handles language change through modal', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    // Open modal
    const languageChangeButton = screen.getByTestId('language-change-button');
    fireEvent.press(languageChangeButton);
    
    // Select Hindi
    await waitFor(() => {
      expect(screen.queryByTestId('language-modal')).toBeTruthy();
    });
    
    const selectHindiButton = screen.getByTestId('select-hindi');
    fireEvent.press(selectHindiButton);
    
    // Verify onLanguageChange was called
    expect(mockOnLanguageChange).toHaveBeenCalledWith(Language.HINDI);
  });

  test('renders photo upload component', () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    expect(screen.getByTestId('photo-upload')).toBeTruthy();
    expect(screen.getByText('Photo Upload Component')).toBeTruthy();
  });

  test('validates photo is required', async () => {
    render(
      <SignUpForm 
        onSignUp={mockOnSignUp} 
        onSwitchToLogin={mockOnSwitchToLogin}
        onBack={mockOnBack}
        onLanguageChange={mockOnLanguageChange}
        language={Language.ENGLISH}
      />
    );
    
    const nameInput = screen.getByTestId('name-input');
    const phoneInput = screen.getByTestId('phone-input');
    
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(phoneInput, '9876543210');
    
    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('photo-error')).toBeTruthy();
      expect(screen.getByText('Photo is required')).toBeTruthy();
    });
  });
}); 