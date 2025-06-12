import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Platform,
  AppState,
} from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../../context/LanguageContext';

type OnboardingStackParamList = {
  Location: { name?: string; businessName?: string; mobileNumber?: string; photoUri?: string; city?: string };
  Main: { name?: string; businessName?: string; mobileNumber?: string; photoUri?: string; city?: string };
};

type LocationNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'Location'
>;
type LocationRouteProp = RouteProp<OnboardingStackParamList, 'Location'>;

const translations = {
  english: {
    title: 'Set Your Business Location',
    welcome: 'One last step',
    description:
      'Providing your location helps us target your job posts to qualified candidates in the area.',
    enableLocation: 'Set Business Location',
    benefit1: 'Reach relevant candidates near you',
    benefit2: 'Increase your job post visibility',
    benefit3: 'Hire local talent faster',
    locationPermission: 'Location Access Denied',
    locationPermissionMessage:
      'To target local candidates, Kaabil Staff needs location access. Please enable it in your app settings.',
    openSettings: 'Open Settings',
    locationError: 'Location Error',
    locationErrorMessage:
      'Could not get your location. Please ensure GPS is on and try again.',
    gettingLocation: 'Finding your location...',
  },
  hindi: {
    title: 'अपने व्यवसाय का स्थान सेट करें',
    welcome: 'एक अंतिम चरण',
    description:
      'अपना स्थान प्रदान करने से हमें आपके नौकरी पोस्ट को क्षेत्र के योग्य उम्मीदवारों तक लक्षित करने में मदद मिलती है।',
    enableLocation: 'व्यावसायिक स्थान सेट करें',
    benefit1: 'अपने आस-पास प्रासंगिक उम्मीदवारों तक पहुँचें',
    benefit2: 'अपनी नौकरी पोस्ट की दृश्यता बढ़ाएँ',
    benefit3: 'स्थानीय प्रतिभा को तेजी से काम पर रखें',
    locationPermission: 'स्थान पहुंच अस्वीकृत',
    locationPermissionMessage:
      'स्थानीय उम्मीदवारों को लक्षित करने के लिए, Kaabil Staff को स्थान पहुंच की आवश्यकता है। कृपया इसे अपनी ऐप सेटिंग्स में सक्षम करें।',
    openSettings: 'सेटिंग्स खोलें',
    locationError: 'स्थान त्रुटि',
    locationErrorMessage:
      'आपका स्थान नहीं मिल सका। कृपया सुनिश्चित करें कि GPS चालू है और पुनः प्रयास करें।',
    gettingLocation: 'आपका स्थान ढूंढा जा रहा है...',
  },
  bengali: {
    title: 'আপনার ব্যবসার অবস্থান সেট করুন',
    welcome: 'একটি শেষ পদক্ষেপ',
    description:
      'আপনার অবস্থান প্রদান করলে আমরা আপনার কাজের পোস্টগুলিকে এলাকার যোগ্য প্রার্থীদের কাছে লক্ষ্য করতে সাহায্য করি।',
    enableLocation: 'ব্যবসার অবস্থান সেট করুন',
    benefit1: 'আপনার কাছাকাছি প্রাসঙ্গিক প্রার্থীদের কাছে পৌঁছান',
    benefit2: 'আপনার কাজের পোস্টের দৃশ্যমানতা বাড়ান',
    benefit3: 'স্থানীয় প্রতিভা দ্রুত নিয়োগ করুন',
    locationPermission: 'অবস্থান অ্যাক্সেস अस्वीकृत',
    locationPermissionMessage:
      'স্থানীয় প্রার্থীদের লক্ষ্য করতে, Kaabil Staff কে অবস্থান অ্যাক্সেসের প্রয়োজন। অনুগ্রহ করে আপনার অ্যাপ সেটিংসে এটি সক্ষম করুন।',
    openSettings: 'সেটিংস খুলুন',
    locationError: 'অবস্থান ত্রুটি',
    locationErrorMessage:
      'আপনার অবস্থান পেতে পারিনি। অনুগ্রহ করে নিশ্চিত করুন GPS চালু আছে এবং আবার চেষ্টা করুন।',
    gettingLocation: 'আপনার অবস্থান খোঁজা হচ্ছে...',
  },
};

const LocationScreen = () => {
  const navigation = useNavigation<LocationNavigationProp>();
  const route = useRoute<LocationRouteProp>();
  const { language } = useLanguage();
  const { name, businessName, mobileNumber, photoUri, city } = route.params;
  // For login users, name might be undefined or 'User', handle gracefully
  const displayName = name && name !== 'User' ? name : undefined;

  const [loading, setLoading] = useState(false);
  const t = translations[language];
  const appState = useRef(AppState.currentState);

  const requestLocationPermission = async () => {
    setLoading(true);

    try {
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          t.locationError,
          'Please enable location services in your device settings and try again.',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            { text: t.openSettings, onPress: () => Linking.openSettings() },
          ]
        );
        setLoading(false);
        return;
      }

      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          t.locationPermission,
          t.locationPermissionMessage,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            { text: t.openSettings, onPress: () => Linking.openSettings() },
          ]
        );
        setLoading(false);
        return;
      }

      // Get location with timeout and fallback options
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // 10 seconds timeout
        distanceInterval: 0,
      });

      // In a real app, you would now save this location and navigate
      console.log('Location granted:', location.coords);
      navigation.navigate('Main', {
        name: displayName || 'User',
        businessName: businessName,
        mobileNumber: mobileNumber,
        photoUri: photoUri,
        city: city,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      
      let errorMessage = t.locationErrorMessage;
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'E_LOCATION_TIMEOUT') {
          errorMessage = 'Location request timed out. Please make sure you have a clear view of the sky and try again.';
        } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
          errorMessage = 'Location services are not available. Please check your GPS settings.';
        }
      }
      
      Alert.alert(
        t.locationError, 
        errorMessage,
        [
          { text: 'Try Again', onPress: () => requestLocationPermission() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="business" size={80} color="#304FFE" />
          </View>

          <View style={styles.header}>
            <Text style={styles.welcomeText}>
              {displayName ? (
                <>
                  {t.welcome}, <Text style={styles.userNameText}>{displayName}</Text>!
                </>
              ) : (
                t.welcome
              )}
              🎉
            </Text>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.description}>{t.description}</Text>
          </View>

          <View style={styles.benefitsListContainer}>
            {[t.benefit1, t.benefit2, t.benefit3].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <MaterialIcons
                  name="check-circle-outline"
                  size={22}
                  color="#304FFE"
                  style={styles.benefitIcon}
                />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity
            style={[styles.enableButton, loading && styles.enableButtonDisabled]}
            onPress={requestLocationPermission}
            disabled={loading}
            activeOpacity={0.75}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#F0F4F8" size="small" />
                <Text style={styles.enableButtonText}>
                  {t.gettingLocation}
                </Text>
              </>
            ) : (
              <Text style={styles.enableButtonText}>{t.enableLocation}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    color: '#F0F4F8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(48, 79, 254, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#A0AEC0',
    marginBottom: 12,
  },
  userNameText: {
    color: '#F0F4F8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  benefitsListContainer: {
    width: '100%',
    paddingLeft: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  benefitIcon: {
    marginRight: 15,
  },
  benefitText: {
    fontSize: 16,
    color: '#F0F4F8',
    flexShrink: 1,
  },
  footerActions: {
    paddingBottom: 20,
  },
  enableButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  enableButtonDisabled: {
    backgroundColor: '#1E40AF',
  },
  enableButtonText: {
    color: '#F0F4F8',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default LocationScreen; 