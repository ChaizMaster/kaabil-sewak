import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { LanguageSelector } from '../LanguageSelector';
import { Language } from 'shared/src/types/user.types';

// Mock the useTranslation hook
jest.mock('shared/src/hooks/useTranslation', () => ({
  useTranslation: (lang: Language) => ({
    t: {
      selectLanguage: lang === Language.HINDI ? 'अपनी भाषा चुनें' : 
                      lang === Language.BENGALI ? 'আপনার ভাষা নির্বাচন করুন' : 
                      'Select Your Language',
      continue: lang === Language.HINDI ? 'आगे बढ़ें' : 
                lang === Language.BENGALI ? 'এগিয়ে যান' : 
                'Continue',
    },
    currentLanguage: lang,
    availableLanguages: [Language.ENGLISH, Language.HINDI, Language.BENGALI],
  }),
}));

describe('LanguageSelector Component', () => {
  const mockOnLanguageSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with English as default', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    expect(screen.getByText('Select Your Language')).toBeTruthy();
    expect(screen.getByText('English')).toBeTruthy();
    expect(screen.getByText('हिंदी')).toBeTruthy();
    expect(screen.getByText('বাংলা')).toBeTruthy();
  });

  test('shows selected language with checkmark', () => {
    render(
      <LanguageSelector 
        onLanguageSelect={mockOnLanguageSelect} 
        selectedLanguage={Language.HINDI}
      />
    );
    
    const hindiOption = screen.getByTestId('language-hindi');
    expect(hindiOption).toBeTruthy();
    expect(screen.getByText('✓')).toBeTruthy();
  });

  test('calls onLanguageSelect when Hindi is selected', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    const hindiOption = screen.getByTestId('language-hindi');
    fireEvent.press(hindiOption);
    
    expect(mockOnLanguageSelect).toHaveBeenCalledWith(Language.HINDI);
  });

  test('calls onLanguageSelect when Bengali is selected', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    const bengaliOption = screen.getByTestId('language-bengali');
    fireEvent.press(bengaliOption);
    
    expect(mockOnLanguageSelect).toHaveBeenCalledWith(Language.BENGALI);
  });

  test('displays translated text for selected language', () => {
    render(
      <LanguageSelector 
        onLanguageSelect={mockOnLanguageSelect} 
        selectedLanguage={Language.HINDI}
      />
    );
    
    expect(screen.getByText('अपनी भाषा चुनें')).toBeTruthy();
  });

  test('continue button is disabled when no language selected', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).toBeDisabled();
  });

  test('continue button is enabled when language is selected', () => {
    render(
      <LanguageSelector 
        onLanguageSelect={mockOnLanguageSelect} 
        selectedLanguage={Language.ENGLISH}
      />
    );
    
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).not.toBeDisabled();
  });

  test('calls onContinue when continue button is pressed', () => {
    const mockOnContinue = jest.fn();
    render(
      <LanguageSelector 
        onLanguageSelect={mockOnLanguageSelect}
        onContinue={mockOnContinue}
        selectedLanguage={Language.ENGLISH}
      />
    );
    
    const continueButton = screen.getByTestId('continue-button');
    fireEvent.press(continueButton);
    
    expect(mockOnContinue).toHaveBeenCalled();
  });

  test('has proper accessibility labels', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    expect(screen.getByLabelText('Select English language')).toBeTruthy();
    expect(screen.getByLabelText('Select Hindi language')).toBeTruthy();
    expect(screen.getByLabelText('Select Bengali language')).toBeTruthy();
  });

  test('shows large text and touch targets for accessibility', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    const englishOption = screen.getByTestId('language-english');
    const styles = englishOption.props.style;
    
    // Check minimum touch target size (44px)
    expect(styles.minHeight).toBeGreaterThanOrEqual(44);
  });
}); 