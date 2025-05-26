import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { LanguageSelector } from '../components/onboarding/LanguageSelector';
import { SignUpForm } from '../components/auth/SignUpForm';
import { Language, SignUpData } from 'shared/src/types/user.types';

enum OnboardingStep {
  LANGUAGE_SELECTION = 'language_selection',
  SIGN_UP = 'sign_up',
}

interface OnboardingScreenProps {
  onComplete: (userData: SignUpData) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.LANGUAGE_SELECTION);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleLanguageContinue = () => {
    if (selectedLanguage) {
      setCurrentStep(OnboardingStep.SIGN_UP);
    }
  };

  const handleSignUp = async (signUpData: SignUpData) => {
    try {
      setIsLoading(true);
      setError(undefined);
      
      // Simulate API call for signup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pass the complete user data to parent
      onComplete(signUpData);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    // For now, just show an alert
    // In a real app, this would navigate to login screen
    console.log('Switch to login - to be implemented');
  };

  const handleBackToLanguage = () => {
    setCurrentStep(OnboardingStep.LANGUAGE_SELECTION);
    setError(undefined);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case OnboardingStep.LANGUAGE_SELECTION:
        return (
          <LanguageSelector
            onLanguageSelect={handleLanguageSelect}
            onContinue={handleLanguageContinue}
            selectedLanguage={selectedLanguage}
          />
        );
      
      case OnboardingStep.SIGN_UP:
        return (
          <SignUpForm
            onSignUp={handleSignUp}
            onSwitchToLogin={handleSwitchToLogin}
            language={selectedLanguage || Language.ENGLISH}
            isLoading={isLoading}
            error={error}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderCurrentStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 