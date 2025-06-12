import React from 'react';
import { NewAuthFlow } from './src/components/NewAuthFlow';
import { NavigationContainer } from '@react-navigation/native';
import { AppTheme } from './src/styles/theme';

export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      <NewAuthFlow />
    </NavigationContainer>
  );
}
 