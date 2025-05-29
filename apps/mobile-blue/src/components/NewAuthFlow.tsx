import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LanguageSelectionScreen } from '../screens/auth/LanguageSelectionScreen';
import { AuthChoiceScreen } from '../screens/auth/AuthChoiceScreen';
import { SignupScreen, SignupData } from '../screens/auth/SignupScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';
import { PhotoUploadScreen } from '../screens/auth/PhotoUploadScreen';
import { LocationPermissionScreen } from '../screens/auth/LocationPermissionScreen';
import authService from '../services/authService';

type AuthStep = 
  | 'language_selection' 
  | 'auth_choice' 
  | 'signup' 
  | 'login' 
  | 'otp' 
  | 'photo_upload' 
  | 'location_permission';

interface NewAuthFlowProps {
  onAuthSuccess: (userData: UserAuthData) => void;
}

interface UserAuthData {
  isAuthenticated: boolean;
  language: 'english' | 'hindi' | 'bengali';
  signupData?: SignupData;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

const STORAGE_KEYS = {
  LANGUAGE: 'user_language',
  AUTH_STATUS: 'auth_status',
  USER_DATA: 'user_data',
};

export const NewAuthFlow: React.FC<NewAuthFlowProps> = ({ onAuthSuccess }) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('language_selection');
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | 'bengali'>('english');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signupData, setSignupData] = useState<SignupData | undefined>();
  const [photoUri, setPhotoUri] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number; address?: string} | undefined>();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      // Clear any existing auth state for debugging (remove this later)
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_STATUS, STORAGE_KEYS.USER_DATA, STORAGE_KEYS.LANGUAGE]);
      console.log('Cleared all auth state for fresh start');
      
      // Check if user is already authenticated
      const authStatus = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_STATUS);
      
      if (authStatus === 'authenticated') {
        console.log('User already authenticated, loading saved data');
        
        // Load saved user data
        const savedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          console.log('Found saved user data, proceeding to main app');
          onAuthSuccess(userData);
          return;
        }
      }

      // Check if language was previously selected
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage as 'english' | 'hindi' | 'bengali');
        setCurrentStep('auth_choice');
      } else {
        setCurrentStep('language_selection');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setCurrentStep('language_selection');
    }
  };

  const handleLanguageSelected = async (language: 'english' | 'hindi' | 'bengali') => {
    setSelectedLanguage(language);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    setCurrentStep('auth_choice');
  };

  const handleSignupSelected = () => {
    setIsNewUser(true);
    setCurrentStep('signup');
  };

  const handleLoginSelected = () => {
    setIsNewUser(false);
    setCurrentStep('login');
  };

  const handleSignupComplete = (phoneNum: string, data: SignupData) => {
    setPhoneNumber(phoneNum);
    setSignupData(data);
    setCurrentStep('otp');
  };

  const handleLoginOTPRequest = (phoneNum: string) => {
    setPhoneNumber(phoneNum);
    setCurrentStep('otp');
  };

  const handleOTPVerificationSuccess = async () => {
    if (isNewUser && signupData) {
      // For new users, proceed to photo upload
      setCurrentStep('photo_upload');
    } else {
      // For existing users, go directly to main app
      const userData: UserAuthData = {
        isAuthenticated: true,
        language: selectedLanguage,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'authenticated');
      onAuthSuccess(userData);
    }
  };

  const handlePhotoUploaded = async (photoUri: string) => {
    setPhotoUri(photoUri);
    setCurrentStep('location_permission');
  };

  const handleLocationGranted = async (location: {latitude: number; longitude: number; address?: string}) => {
    setUserLocation(location);
    
    // Create complete user data and save
    const userData: UserAuthData = {
      isAuthenticated: true,
      language: selectedLanguage,
      signupData,
      photoUri,
      location,
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'authenticated');
    
    // Go directly to main app without intermediate screen
    onAuthSuccess(userData);
  };

  const handleGoBackToLanguageSelection = () => {
    setCurrentStep('language_selection');
  };

  const handleGoBackToAuthChoice = () => {
    setCurrentStep('auth_choice');
  };

  const handleGoBackToSignup = () => {
    setCurrentStep('signup');
  };

  const handleGoBackToLogin = () => {
    setCurrentStep('login');
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_STATUS, STORAGE_KEYS.USER_DATA]);
      setCurrentStep('auth_choice');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'language_selection':
        return (
          <LanguageSelectionScreen 
            onLanguageSelected={handleLanguageSelected}
          />
        );

      case 'auth_choice':
        return (
          <AuthChoiceScreen 
            onSignup={handleSignupSelected}
            onLogin={handleLoginSelected}
            onGoBack={handleGoBackToLanguageSelection}
            language={selectedLanguage}
          />
        );

      case 'signup':
        return (
          <SignupScreen 
            onNavigateToOTP={handleSignupComplete}
            onGoBack={handleGoBackToAuthChoice}
            language={selectedLanguage}
          />
        );

      case 'login':
        return (
          <LoginScreen 
            onNavigateToOTP={handleLoginOTPRequest}
            onGoBack={handleGoBackToAuthChoice}
            language={selectedLanguage}
          />
        );

      case 'otp':
        return (
          <OTPScreen
            phoneNumber={phoneNumber}
            onVerificationSuccess={handleOTPVerificationSuccess}
            onGoBack={isNewUser ? handleGoBackToSignup : handleGoBackToLogin}
            language={selectedLanguage}
          />
        );

      case 'photo_upload':
        return (
          <PhotoUploadScreen
            onPhotoUploaded={handlePhotoUploaded}
            language={selectedLanguage}
            userName={signupData?.fullName || 'User'}
          />
        );

      case 'location_permission':
        return (
          <LocationPermissionScreen
            onLocationGranted={handleLocationGranted}
            language={selectedLanguage}
            userName={signupData?.fullName || 'User'}
          />
        );

      default:
        return (
          <LanguageSelectionScreen 
            onLanguageSelected={handleLanguageSelected}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export type { UserAuthData }; 