import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageSelectionScreen } from '../screens/auth/LanguageSelectionScreen';
import { AuthChoiceScreen } from '../screens/auth/AuthChoiceScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';
import { PhotoUploadScreen } from '../screens/auth/PhotoUploadScreen';
import { LocationPermissionScreen } from '../screens/auth/LocationPermissionScreen';
import { JobsScreen } from '../screens/jobs/JobsScreen';
import { UserProfileScreen } from '../screens/profile/UserProfileScreen';

type AuthStep = 'language_selection' | 'auth_choice' | 'signup' | 'login' | 'otp' | 'photo_upload' | 'location_permission' | 'jobs' | 'profile';

interface UserData {
  isAuthenticated: boolean;
  language: 'english' | 'hindi' | 'bengali';
  signupData?: {
    fullName: string;
    phoneNumber: string;
    city: string;
  };
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export const NewAuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('language_selection');
  const [userData, setUserData] = useState<UserData>({
    isAuthenticated: false,
    language: 'english',
  });
  const [authType, setAuthType] = useState<'signup' | 'login'>('signup');

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      // Clear any existing data for fresh start
      await AsyncStorage.clear();
      setCurrentStep('language_selection');
    } catch (error) {
      console.error('Error checking auth:', error);
      setCurrentStep('language_selection');
    }
  };

  const handleLanguageSelect = async (language: 'english' | 'hindi' | 'bengali') => {
    const updatedData = { ...userData, language };
    setUserData(updatedData);
    await AsyncStorage.setItem('user_data', JSON.stringify(updatedData));
    setCurrentStep('auth_choice');
  };

  const handleAuthChoice = (choice: 'signup' | 'login') => {
    setAuthType(choice);
    setCurrentStep(choice);
  };

  const handleSignupComplete = (phoneNumber: string, signupData: any) => {
    const updatedData = { 
      ...userData, 
      signupData: {
        fullName: signupData.fullName,
        phoneNumber: phoneNumber,
        city: signupData.city,
      }
    };
    setUserData(updatedData);
    setCurrentStep('otp');
  };

  const handleLoginSubmit = (phoneNumber: string) => {
    const updatedData = { 
      ...userData, 
      signupData: { 
        fullName: userData.signupData?.fullName || '',
        phoneNumber: phoneNumber,
        city: userData.signupData?.city || '',
      } 
    };
    setUserData(updatedData);
    setCurrentStep('otp');
  };

  const handleOTPVerified = () => {
    if (authType === 'signup') {
      setCurrentStep('photo_upload');
    } else {
      const updatedData = { ...userData, isAuthenticated: true };
      setUserData(updatedData);
      setCurrentStep('jobs');
    }
  };

  const handlePhotoUploaded = (photoUri?: string) => {
    const updatedData = { ...userData, photoUri };
    setUserData(updatedData);
    setCurrentStep('location_permission');
  };

  const handleLocationPermissionGranted = (location: any) => {
    const updatedData = { 
      ...userData, 
      location,
      isAuthenticated: true 
    };
    setUserData(updatedData);
    setCurrentStep('jobs');
  };

  const handleProfilePress = () => {
    setCurrentStep('profile');
  };

  const handleProfileBack = () => {
    setCurrentStep('jobs');
  };

  const handleProfileUpdated = (updatedData: UserData) => {
    setUserData(updatedData);
  };

  const handleGoBackToAuthChoice = () => {
    setCurrentStep('auth_choice');
  };

  const handleGoBackToLanguageSelection = () => {
    setCurrentStep('language_selection');
  };

  const handleGoBackToSignup = () => {
    setCurrentStep('signup');
  };

  const handleGoBackToLogin = () => {
    setCurrentStep('login');
  };

  switch (currentStep) {
    case 'language_selection':
      return (
        <LanguageSelectionScreen
          onLanguageSelected={handleLanguageSelect}
        />
      );

    case 'auth_choice':
      return (
        <AuthChoiceScreen
          language={userData.language}
          onSignup={() => handleAuthChoice('signup')}
          onLogin={() => handleAuthChoice('login')}
          onGoBack={handleGoBackToLanguageSelection}
        />
      );

    case 'signup':
      return (
        <SignupScreen
          language={userData.language}
          onNavigateToOTP={handleSignupComplete}
          onGoBack={handleGoBackToAuthChoice}
        />
      );

    case 'login':
      return (
        <LoginScreen
          language={userData.language}
          onNavigateToOTP={handleLoginSubmit}
          onGoBack={handleGoBackToAuthChoice}
        />
      );

    case 'otp':
      return (
        <OTPScreen
          language={userData.language}
          phoneNumber={userData.signupData?.phoneNumber || ''}
          onVerificationSuccess={handleOTPVerified}
          onGoBack={authType === 'signup' ? handleGoBackToSignup : handleGoBackToLogin}
        />
      );

    case 'photo_upload':
      return (
        <PhotoUploadScreen
          language={userData.language}
          userName={userData.signupData?.fullName || 'User'}
          onPhotoUploaded={handlePhotoUploaded}
        />
      );

    case 'location_permission':
      return (
        <LocationPermissionScreen
          language={userData.language}
          userName={userData.signupData?.fullName || 'User'}
          onLocationGranted={handleLocationPermissionGranted}
        />
      );

    case 'jobs':
      return (
        <JobsScreen
          userLanguage={userData.language}
          userName={userData.signupData?.fullName}
          userLocation={userData.location}
          onProfilePress={handleProfilePress}
        />
      );

    case 'profile':
      return (
        <UserProfileScreen
          userLanguage={userData.language}
          userData={userData}
          onGoBack={handleProfileBack}
          onProfileUpdated={handleProfileUpdated}
        />
      );

    default:
      return null;
  }
};

export type { UserData }; 