import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NewAuthFlow, UserAuthData } from './src/components/NewAuthFlow';
import { JobsScreen } from './src/screens/jobs/JobsScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserAuthData | null>(null);

  const handleAuthSuccess = (authData: UserAuthData) => {
    setUserData(authData);
    setIsAuthenticated(true);
  };

  // Show authentication flow first
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <NewAuthFlow onAuthSuccess={handleAuthSuccess} />
      </SafeAreaView>
    );
  }

  // Show jobs screen after authentication
  return (
    <SafeAreaView style={styles.container}>
      <JobsScreen 
        userLanguage={userData?.language || 'english'}
        userName={userData?.signupData?.fullName}
        userLocation={userData?.location}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
 