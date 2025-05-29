import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import authService from '../../services/authService';

interface SuccessScreenProps {
  onContinue: () => void;
  onSignOut: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onContinue,
  onSignOut,
}) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { userData } = await authService.getUserSession();
      setUserData(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const formatPhoneDisplay = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace('+91', '');
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
              Toast.show({
                type: 'success',
                text1: 'Signed Out',
                text2: 'You have been signed out successfully',
              });
              onSignOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Toast.show({
                type: 'error',
                text1: 'Sign Out Failed',
                text2: 'Please try again',
              });
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.successIcon}>✅</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>सफल!</Text>
          <Text style={styles.titleEng}>Authentication Successful!</Text>
          <Text style={styles.subtitle}>
            Welcome to Kaabil Sewak
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <Text style={styles.phoneNumber}>
            +91 {formatPhoneDisplay(userData?.phoneNumber || '')}
          </Text>
          
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.userId}>
            {userData?.uid || 'Loading...'}
          </Text>
          
          {userData?.lastLogin && (
            <>
              <Text style={styles.infoLabel}>Last Login</Text>
              <Text style={styles.lastLogin}>
                {new Date(userData.lastLogin).toLocaleString()}
              </Text>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
          >
            <Text style={styles.continueButtonText}>
              Continue to App
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Debug Info */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>🔍 Debug Information</Text>
          <Text style={styles.debugText}>
            Firebase Auth: Connected ✅
          </Text>
          <Text style={styles.debugText}>
            Session: Stored securely ✅
          </Text>
          <Text style={styles.debugText}>
            Ready for manual testing! 🚀
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    fontSize: 64,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleEng: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userId: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 8,
  },
  lastLogin: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  signOutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  debugInfo: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
}); 