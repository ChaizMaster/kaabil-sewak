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

interface LocationPermissionScreenProps {
  onLocationGranted: (location: { latitude: number; longitude: number; address?: string }) => void;
  language: 'english' | 'hindi' | 'bengali';
  userName: string;
}

const translations = {
  english: {
    title: 'Unlock Local Job Matches',
    welcome: 'One last step',
    description: 'Sharing your location helps us connect you with the best job opportunities right in your neighborhood.',
    enableLocation: 'Allow Location Access',
    benefit1: 'See jobs available near you',
    benefit2: 'Get relevant local alerts',
    benefit3: 'Reduce your commute time',
    locationPermission: 'Location Access Denied',
    locationPermissionMessage: 'To find jobs near you, Kaabil Sewak needs location access. Please enable it in your app settings.',
    openSettings: 'Open Settings',
    locationError: 'Location Error',
    locationErrorMessage: 'Could not get your location. Please ensure GPS is on and try again.',
    gettingLocation: 'Finding your location...',
  },
  hindi: {
    title: 'स्थानीय नौकरी मैच अनलॉक करें',
    welcome: 'एक अंतिम चरण',
    description: 'अपना स्थान साझा करने से हमें आपके पड़ोस में ही सर्वोत्तम नौकरी के अवसर खोजने में मदद मिलती है।',
    enableLocation: 'स्थान पहुंच की अनुमति दें',
    benefit1: 'अपने आस-पास उपलब्ध नौकरियां देखें',
    benefit2: 'प्रासंगिक स्थानीय अलर्ट प्राप्त करें',
    benefit3: 'अपने आने-जाने का समय कम करें',
    locationPermission: 'स्थान पहुंच अस्वीकृत',
    locationPermissionMessage: 'आपके आस-पास नौकरियां ढूंढने के लिए, काबिल सेवक को स्थान पहुंच की आवश्यकता है। कृपया इसे अपनी ऐप सेटिंग्स में सक्षम करें।',
    openSettings: 'सेटिंग्स खोलें',
    locationError: 'स्थान त्रुटि',
    locationErrorMessage: 'आपका स्थान नहीं मिल सका। कृपया सुनिश्चित करें कि GPS चालू है और पुनः प्रयास करें।',
    gettingLocation: 'आपका स्थान ढूंढा जा रहा है...',
  },
  bengali: {
    title: 'স্থানীয় কাজের ম্যাচ আনলক করুন',
    welcome: 'একটি শেষ পদক্ষেপ',
    description: 'আপনার অবস্থান শেয়ার করলে আমরা আপনাকে আপনার আশেপাশের সেরা কাজের সুযোগগুলির সাথে সংযুক্ত করতে সাহায্য করি।',
    enableLocation: 'অবস্থান অ্যাক্সেসের অনুমতি দিন',
    benefit1: 'আপনার কাছাকাছি উপলব্ধ কাজ দেখুন',
    benefit2: 'প্রাসঙ্গিক স্থানীয় সতর্কতা পান',
    benefit3: 'আপনার যাতায়াতের সময় কমান',
    locationPermission: 'অবস্থান অ্যাক্সেস अस्वीकृत',
    locationPermissionMessage: 'আপনার কাছাকাছি কাজ খুঁজে পেতে কাবিল সেবককে অবস্থান অ্যাক্সেসের প্রয়োজন। অনুগ্রহ করে আপনার অ্যাপ সেটিংসে এটি সক্ষম করুন।',
    openSettings: 'সেটিংস খুলুন',
    locationError: 'অবস্থান ত্রুটি',
    locationErrorMessage: 'আপনার অবস্থান পেতে পারিনি। অনুগ্রহ করে নিশ্চিত করুন GPS চালু আছে এবং আবার চেষ্টা করুন।',
    gettingLocation: 'আপনার অবস্থান খোঁজা হচ্ছে...',
  },
};

export const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onLocationGranted,
  language,
  userName,
}) => {
  const [loading, setLoading] = useState(false);
  const t = translations[language];
  const appState = useRef(AppState.currentState);
  const wasLoadingWhenBackgrounded = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        if (wasLoadingWhenBackgrounded.current) {
          console.log('Retrying location permission request after returning from background.');
          requestLocationPermission(); 
        }
      }

      appState.current = nextAppState;
      if (appState.current.match(/inactive|background/)) {
        if(loading) {
            wasLoadingWhenBackgrounded.current = true;
        } else {
            wasLoadingWhenBackgrounded.current = false;
        }
      } else if (appState.current === 'active') {
        wasLoadingWhenBackgrounded.current = false;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loading]);

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (Platform.OS === 'android') {
          try {
            await Location.enableNetworkProviderAsync();
            const stillDisabled = !(await Location.hasServicesEnabledAsync());
            if (stillDisabled) {
              Alert.alert(
                t.locationError,
                t.locationErrorMessage,
                [
                  { text: t.openSettings, onPress: () => Linking.openSettings() },
                  { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
                ]
              );
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("enableNetworkProviderAsync failed or was cancelled", e);
            Alert.alert(
              t.locationError,
              t.locationErrorMessage,
              [
                { text: t.openSettings, onPress: () => Linking.openSettings() },
                { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
              ]
            );
            setLoading(false);
            return;
          }
        } else { 
          Alert.alert(
            t.locationError,
            "Location services are turned off. Please turn them on in your device settings to continue.",
            [
              { text: t.openSettings, onPress: () => Linking.openSettings() },
              { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            ]
          );
          setLoading(false);
          return;
        }
      }

      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }
      
      if (status !== 'granted') {
        Alert.alert(
          t.locationPermission,
          t.locationPermissionMessage,
          [
            { text: t.openSettings, onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          ]
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let address: string | undefined;
      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (addressResponse && addressResponse[0]) {
          const adr = addressResponse[0];
          address = [
            adr.streetNumber, adr.street, adr.subregion, adr.city, adr.region, adr.postalCode
          ].filter(Boolean).join(', ');
        }
      } catch (geoError) {
        console.warn('Reverse geocoding failed or not available:', geoError);
      }

      onLocationGranted({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Error in requestLocationPermission:', error);
      if (error.message && (error.message.includes("Location provider is unavailable") || error.message.includes("Location services are disabled"))) {
         Alert.alert(t.locationError, t.locationErrorMessage, [
            { text: t.openSettings, onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          ]);
      } else {
        Alert.alert(t.locationError, error.message || t.locationErrorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="location-on" size={80} color="#304FFE" />
            </View>

            <View style={styles.header}>
                <Text style={styles.welcomeText}>
                {t.welcome}, <Text style={styles.userNameText}>{userName}</Text>! 🎉
                </Text>
                <Text style={styles.title}>{t.title}</Text>
                <Text style={styles.description}>{t.description}</Text>
            </View>

            <View style={styles.benefitsListContainer}>
                {[t.benefit1, t.benefit2, t.benefit3].map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                    <MaterialIcons name="check-circle-outline" size={22} color="#304FFE" style={styles.benefitIcon} />
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
                    <ActivityIndicator color="#F0F4F8" size="small" style={styles.buttonLoaderIcon} />
                    <Text style={styles.enableButtonText}>{t.gettingLocation}</Text>
                </>
                ) : (
                <>
                    <MaterialIcons name="my-location" size={22} color="#F0F4F8" style={styles.buttonActionIcon} />
                    <Text style={styles.enableButtonText}>{t.enableLocation}</Text>
                </>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  mainContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'rgba(23, 42, 70, 0.6)',
    borderRadius: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 22,
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 12,
  },
  userNameText: {
    color: '#F055A8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 23,
    paddingHorizontal: 10,
  },
  benefitsListContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(23, 42, 70, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.15)',
  },
  benefitIcon: {
    marginRight: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#D0D6E0',
    lineHeight: 21,
    flexShrink: 1,
  },
  footerActions: {
    paddingBottom: 10,
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(48, 79, 254, 0.8)',
    borderRadius: 18,
    paddingVertical: 18,
    minHeight: 60,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.35)',
  },
  enableButtonDisabled: {
    backgroundColor: 'rgba(48, 79, 254, 0.45)',
  },
  buttonLoaderIcon: {
    marginRight: 10,
  },
  buttonActionIcon: {
    marginRight: 10,
  },
  enableButtonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
}); 