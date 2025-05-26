import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AudioButton } from '../AudioButton';
import { Language } from 'shared/src/types/user.types';

describe('AudioButton Component', () => {
  const mockText = 'Test job description for audio playback';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render audio button with speaker icon', () => {
    render(<AudioButton text={mockText} />);
    expect(screen.getByText('🔈')).toBeVisible();
  });

  it('should show playing state when pressed', () => {
    render(<AudioButton text={mockText} testID="audio-button" />);
    
    const button = screen.getByTestId('audio-button');
    fireEvent.press(button);
    
    expect(screen.getByText('🔊')).toBeVisible();
    expect(screen.getByText('Playing...')).toBeVisible();
  });

  it('should be disabled while playing', () => {
    render(<AudioButton text={mockText} testID="audio-button" />);
    
    const button = screen.getByTestId('audio-button');
    fireEvent.press(button);
    
    expect(button).toHaveProperty('accessibilityState.disabled', true);
  });

  it('should support different languages', () => {
    render(
      <AudioButton 
        text={mockText} 
        language={Language.HINDI}
        testID="audio-button" 
      />
    );
    
    expect(screen.getByTestId('audio-button')).toBeVisible();
  });

  it('should have proper accessibility label', () => {
    render(
      <AudioButton 
        text={mockText} 
        accessibilityLabel="Listen to job description"
      />
    );
    
    expect(screen.getByLabelText('Listen to job description')).toBeVisible();
  });
}); 