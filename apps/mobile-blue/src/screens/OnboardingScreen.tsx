import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { LanguageSelector } from '../components/onboarding/LanguageSelector';
import { SignUpForm } from '../components/auth/SignUpForm';
import { Language, SignUpData } from 'shared/src/types/user.types';

enum OnboardingStep {
  LANGUAGE_SELECTION = 'language',
  SIGN_UP = 'signup',
}

interface OnboardingScreenProps {
  onComplete: (userData: SignUpData) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.LANGUAGE_SELECTION);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API response - in real app, this would come from your auth service
      console.log('User signed up:', data);
      
      onComplete(data);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLanguageSelection = () => {
    setCurrentStep(OnboardingStep.LANGUAGE_SELECTION);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case OnboardingStep.LANGUAGE_SELECTION:
        return (
          <LanguageSelector
            onLanguageSelect={handleLanguageChange}
            onContinue={() => setCurrentStep(OnboardingStep.SIGN_UP)}
            selectedLanguage={selectedLanguage}
          />
        );
      
      case OnboardingStep.SIGN_UP:
        return (
          <SignUpForm
            onSignUp={handleSignUp}
            onSwitchToLogin={() => console.log('Switch to login')}
            onBack={handleBackToLanguageSelection}
            onLanguageChange={handleLanguageChange}
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