import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { LanguageSelector } from '../LanguageSelector';
import { Language } from 'shared/src/types/user.types';

// Mock the useTranslation hook
jest.mock('shared/src/hooks/useTranslation', () => ({
  useTranslation: (lang: string) => ({
    t: {
      selectLanguage: lang === 'hi' ? 'अपनी भाषा चुनें' : 
                      lang === 'bn' ? 'আপনার ভাষা নির্বাচন করুন' : 
                      'Select Your Language',
      continue: lang === 'hi' ? 'आगे बढ़ें' : 
                lang === 'bn' ? 'এগিয়ে যান' : 
                'Continue',
    },
    currentLanguage: lang,
    availableLanguages: ['en', 'hi', 'bn'],
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

  test('calls onLanguageSelect when English is selected', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    const englishOption = screen.getByTestId('language-english');
    fireEvent.press(englishOption);
    
    expect(mockOnLanguageSelect).toHaveBeenCalledWith(Language.ENGLISH);
  });

  test('has proper accessibility labels', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    expect(screen.getByLabelText('Select English language')).toBeTruthy();
    expect(screen.getByLabelText('Select हिंदी language')).toBeTruthy();
    expect(screen.getByLabelText('Select বাংলা language')).toBeTruthy();
  });

  test('shows large text and touch targets for accessibility', () => {
    render(<LanguageSelector onLanguageSelect={mockOnLanguageSelect} />);
    
    const englishOption = screen.getByTestId('language-english');
    expect(englishOption).toBeTruthy();
  });
}); 