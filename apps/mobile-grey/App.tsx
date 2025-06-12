import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A192F" />
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Dark background to prevent white flash
  },
}); 