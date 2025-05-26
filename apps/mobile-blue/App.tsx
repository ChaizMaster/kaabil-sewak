import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { JobDiscoveryScreen } from './src/screens/JobDiscoveryScreen';
import { SignUpData } from 'shared/src/types/user.types';

export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userData, setUserData] = useState<SignUpData | null>(null);

  const handleOnboardingComplete = (signUpData: SignUpData) => {
    setUserData(signUpData);
    setIsOnboardingComplete(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isOnboardingComplete ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <JobDiscoveryScreen userLanguage={userData?.preferredLanguage} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
 