import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import AuthChoiceScreen from '../screens/auth/AuthChoiceScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
// The following screens will be created in the next steps
import PhotoUploadScreen from '../screens/onboarding/PhotoUploadScreen';
import LocationScreen from '../screens/onboarding/LocationScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

// Custom dark theme to prevent white flashes
const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B82F6',
    background: '#0A192F',
    card: '#1A2942',
    text: '#F0F4F8',
    border: '#2D3748',
    notification: '#3B82F6',
  },
};

const AppNavigator = () => {
  // For now, we will always show the auth flow.
  // User authentication state will be added later.
  const isAuthenticated = false;

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName="LanguageSelection"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0A192F' }, // Consistent background
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Smooth transitions
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
        />
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
