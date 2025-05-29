import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NewAuthFlow, UserData } from './src/components/NewAuthFlow';
import { JobsScreen } from './src/screens/jobs/JobsScreen';
import { Language } from 'shared/src/types/user.types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleAuthSuccess = (authData: UserData) => {
    setUserData(authData);
    setIsAuthenticated(authData.isAuthenticated);
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  // Convert string language to Language enum
  const getLanguageEnum = (lang: 'english' | 'hindi' | 'bengali'): Language => {
    switch (lang) {
      case 'hindi':
        return Language.HINDI;
      case 'bengali':
        return Language.BENGALI;
      default:
        return Language.ENGLISH;
    }
  };

  if (!isAuthenticated && !userData?.isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <NewAuthFlow />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <JobsScreen
        userLanguage={userData?.language || Language.ENGLISH}
        userName={userData?.signupData?.fullName}
        userLocation={userData?.location}
        onProfilePress={handleProfilePress}
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
 