import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { LanguageSelector } from '../components/onboarding/LanguageSelector';
import { SignUpForm } from '../components/auth/SignUpForm';
import { LocationCollector } from '../components/onboarding/LocationCollector';
import { Language, SignUpData, UserLocation } from 'shared/src/types/user.types';

enum OnboardingStep {
  LANGUAGE_SELECTION = 'language',
  SIGN_UP = 'signup',
  LOCATION_COLLECTION = 'location',
}

interface OnboardingScreenProps {
  onComplete: (userData: SignUpData & { location?: UserLocation }) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.LANGUAGE_SELECTION);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>();
  const [signUpData, setSignUpData] = useState<SignUpData | undefined>();
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
      
      // Store sign up data and move to location collection
      setSignUpData(data);
      setCurrentStep(OnboardingStep.LOCATION_COLLECTION);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationCollected = (location: UserLocation) => {
    if (signUpData) {
      onComplete({ ...signUpData, location });
    }
  };

  const handleLocationSkipped = () => {
    if (signUpData) {
      onComplete(signUpData);
    }
  };

  const handleBackToLanguageSelection = () => {
    console.log('Back button pressed - navigating to language selection');
    console.log('Current step before:', currentStep);
    setCurrentStep(OnboardingStep.LANGUAGE_SELECTION);
    console.log('Setting step to:', OnboardingStep.LANGUAGE_SELECTION);
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

      case OnboardingStep.LOCATION_COLLECTION:
        return (
          <LocationCollector
            onLocationCollected={handleLocationCollected}
            onSkip={handleLocationSkipped}
            language={selectedLanguage || Language.ENGLISH}
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