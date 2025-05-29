import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';

interface LocationPermissionScreenProps {
  onLocationGranted: (location: { latitude: number; longitude: number; address?: string }) => void;
  language: 'english' | 'hindi' | 'bengali';
  userName: string;
}

const translations = {
  english: {
    title: 'Enable Location',
    subtitle: 'Help us find jobs near you',
    welcome: 'Almost done',
    description: 'We need your location to show you relevant job opportunities in your area.',
    enableLocation: 'Enable Location',
    allowLocation: 'Allow Location Access',
    locationBenefits: 'Benefits of sharing location:',
    benefit1: '🏠 Get jobs near your area',
    benefit2: '⚡ Faster job matching',
    benefit3: '🚗 Reduced travel time',
    locationPermission: 'Location Permission',
    locationPermissionMessage: 'We need location permission to find jobs near you',
    locationError: 'Location Error',
    locationErrorMessage: 'Could not get your location. Please try again.',
  },
  hindi: {
    title: 'स्थान सक्षम करें',
    subtitle: 'अपने आस-पास की नौकरियां खोजने में हमारी मदद करें',
    welcome: 'लगभग हो गया',
    description: 'आपके क्षेत्र में प्रासंगिक नौकरी के अवसर दिखाने के लिए हमें आपके स्थान की आवश्यकता है।',
    enableLocation: 'स्थान सक्षम करें',
    allowLocation: 'स्थान पहुंच की अनुमति दें',
    locationBenefits: 'स्थान साझा करने के फायदे:',
    benefit1: '🏠 अपने क्षेत्र के पास की नौकरियां पाएं',
    benefit2: '⚡ तेज़ नौकरी मैचिंग',
    benefit3: '🚗 यात्रा का समय कम',
    locationPermission: 'स्थान की अनुमति',
    locationPermissionMessage: 'आपके आस-पास की नौकरियां खोजने के लिए स्थान की अनुमति चाहिए',
    locationError: 'स्थान त्रुटि',
    locationErrorMessage: 'आपका स्थान नहीं मिल सका। कृपया पुनः प्रयास करें।',
  },
  bengali: {
    title: 'অবস্থান সক্রিয় করুন',
    subtitle: 'আপনার কাছাকাছি চাকরি খুঁজে পেতে আমাদের সাহায্য করুন',
    welcome: 'প্রায় শেষ',
    description: 'আপনার এলাকায় প্রাসঙ্গিক চাকরির সুযোগ দেখানোর জন্য আমাদের আপনার অবস্থান প্রয়োজন।',
    enableLocation: 'অবস্থান সক্রিয় করুন',
    allowLocation: 'অবস্থান অ্যাক্সেসের অনুমতি দিন',
    locationBenefits: 'অবস্থান শেয়ার করার সুবিধা:',
    benefit1: '🏠 আপনার এলাকার কাছাকাছি চাকরি পান',
    benefit2: '⚡ দ্রুত চাকরি ম্যাচিং',
    benefit3: '🚗 ভ্রমণের সময় কম',
    locationPermission: 'অবস্থানের অনুমতি',
    locationPermissionMessage: 'আপনার কাছাকাছি চাকরি খুঁজতে অবস্থানের অনুমতি প্রয়োজন',
    locationError: 'অবস্থান ত্রুটি',
    locationErrorMessage: 'আপনার অবস্থান পেতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।',
  },
};

export const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onLocationGranted,
  language,
  userName,
}) => {
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(t.locationPermission, t.locationPermissionMessage);
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Optionally get address (reverse geocoding)
      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const address = addressResponse[0] ? 
          `${addressResponse[0].name || ''} ${addressResponse[0].city || ''} ${addressResponse[0].region || ''}`.trim() : 
          undefined;

        onLocationGranted({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address,
        });
      } catch (error) {
        // If address lookup fails, still proceed with coordinates
        onLocationGranted({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(t.locationError, t.locationErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>
            {t.welcome}, {userName}! 🎉
          </Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
          <Text style={styles.description}>{t.description}</Text>
        </View>

        {/* Location Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>{t.locationBenefits}</Text>
          <Text style={styles.benefitText}>{t.benefit1}</Text>
          <Text style={styles.benefitText}>{t.benefit2}</Text>
          <Text style={styles.benefitText}>{t.benefit3}</Text>
        </View>

        {/* Enable Location Button */}
        <TouchableOpacity
          style={[styles.enableButton, loading && styles.enableButtonDisabled]}
          onPress={requestLocationPermission}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.enableButtonText}>Getting Location...</Text>
            </>
          ) : (
            <>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.enableButtonText}>{t.enableLocation}</Text>
            </>
          )}
        </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  benefitsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  enableButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  enableButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 