import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LocationService } from '../../services/locationService';
import { UserLocation, Language } from 'shared/src/types/user.types';

interface LocationCollectorProps {
  onLocationCollected: (location: UserLocation) => void;
  onSkip: () => void;
  language: Language;
}

const translations = {
  [Language.ENGLISH]: {
    title: 'Your Location',
    subtitle: 'Help us find jobs near you',
    description: 'We use your location to show relevant job opportunities in your area and perform background verification.',
    useCurrentLocation: 'Use Current Location',
    enterManually: 'Enter Manually',
    skip: 'Skip for Now',
    continue: 'Continue',
    addressPlaceholder: 'Enter your address',
    cityPlaceholder: 'City',
    statePlaceholder: 'State',
    pincodePlaceholder: 'PIN Code',
    gettingLocation: 'Getting your location...',
    locationError: 'Location Error',
    fillAllFields: 'Please fill in all required fields',
    locationBenefits: [
      '📍 Find jobs within walking/commuting distance',
      '🔍 Get accurate background verification',
      '⚡ Faster job matching process',
      '🎯 Location-specific job recommendations'
    ]
  },
  [Language.HINDI]: {
    title: 'आपका स्थान',
    subtitle: 'आपके पास की नौकरियां खोजने में मदद करें',
    description: 'हम आपके क्षेत्र में संबंधित नौकरी के अवसर दिखाने और पृष्ठभूमि सत्यापन करने के लिए आपके स्थान का उपयोग करते हैं।',
    useCurrentLocation: 'वर्तमान स्थान का उपयोग करें',
    enterManually: 'मैन्युअल रूप से दर्ज करें',
    skip: 'अभी छोड़ें',
    continue: 'जारी रखें',
    addressPlaceholder: 'अपना पता दर्ज करें',
    cityPlaceholder: 'शहर',
    statePlaceholder: 'राज्य',
    pincodePlaceholder: 'पिन कोड',
    gettingLocation: 'आपका स्थान प्राप्त कर रहे हैं...',
    locationError: 'स्थान त्रुटि',
    fillAllFields: 'कृपया सभी आवश्यक फ़ील्ड भरें',
    locationBenefits: [
      '📍 पैदल/आवागमन की दूरी के भीतर नौकरियां खोजें',
      '🔍 सटीक पृष्ठभूमि सत्यापन प्राप्त करें',
      '⚡ तेज़ नौकरी मिलान प्रक्रिया',
      '🎯 स्थान-विशिष्ट नौकरी सिफारिशें'
    ]
  },
  [Language.BENGALI]: {
    title: 'আপনার অবস্থান',
    subtitle: 'আপনার কাছাকাছি চাকরি খুঁজে পেতে সাহায্য করুন',
    description: 'আমরা আপনার এলাকায় প্রাসঙ্গিক চাকরির সুযোগ দেখাতে এবং পটভূমি যাচাইকরণ সম্পাদন করতে আপনার অবস্থান ব্যবহার করি।',
    useCurrentLocation: 'বর্তমান অবস্থান ব্যবহার করুন',
    enterManually: 'ম্যানুয়ালি প্রবেশ করান',
    skip: 'এখনকে জন্য এড়িয়ে যান',
    continue: 'চালিয়ে যান',
    addressPlaceholder: 'আপনার ঠিকানা লিখুন',
    cityPlaceholder: 'শহর',
    statePlaceholder: 'রাজ্য',
    pincodePlaceholder: 'পিন কোড',
    gettingLocation: 'আপনার অবস্থান নিচ্ছি...',
    locationError: 'অবস্থান ত্রুটি',
    fillAllFields: 'দয়া করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন',
    locationBenefits: [
      '📍 হাঁটা/যাতায়াতের দূরত্বের মধ্যে চাকরি খুঁজুন',
      '🔍 সঠিক পটভূমি যাচাইকরণ পান',
      '⚡ দ্রুত চাকরি মিলানোর প্রক্রিয়া',
      '🎯 অবস্থান-নির্দিষ্ট চাকরির সুপারিশ'
    ]
  }
};

export const LocationCollector: React.FC<LocationCollectorProps> = ({
  onLocationCollected,
  onSkip,
  language
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [location, setLocation] = useState<Partial<UserLocation>>({
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const t = translations[language];

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const result = await LocationService.getCurrentLocation();
      
      if (result.error) {
        Alert.alert(t.locationError, result.error);
        setManualEntry(true);
      } else {
        onLocationCollected(result.location);
      }
    } catch (error) {
      Alert.alert(t.locationError, 'Something went wrong. Please try again.');
      setManualEntry(true);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleManualSubmit = () => {
    if (!location.address || !location.city || !location.state) {
      Alert.alert(t.locationError, t.fillAllFields);
      return;
    }

    const completeLocation: UserLocation = {
      address: location.address!,
      city: location.city!,
      state: location.state!,
      pincode: location.pincode || '',
    };

    onLocationCollected(completeLocation);
  };

  if (isGettingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t.gettingLocation}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
        <Text style={styles.description}>{t.description}</Text>

        <View style={styles.benefitsContainer}>
          {t.locationBenefits.map((benefit, index) => (
            <Text key={index} style={styles.benefitText}>{benefit}</Text>
          ))}
        </View>

        {!manualEntry ? (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetCurrentLocation}
              disabled={isGettingLocation}
            >
              <Text style={styles.primaryButtonText}>{t.useCurrentLocation}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setManualEntry(true)}
            >
              <Text style={styles.secondaryButtonText}>{t.enterManually}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={onSkip}
            >
              <Text style={styles.skipButtonText}>{t.skip}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder={t.addressPlaceholder}
              value={location.address}
              onChangeText={(text) => setLocation(prev => ({ ...prev, address: text }))}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder={t.cityPlaceholder}
                value={location.city}
                onChangeText={(text) => setLocation(prev => ({ ...prev, city: text }))}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder={t.statePlaceholder}
                value={location.state}
                onChangeText={(text) => setLocation(prev => ({ ...prev, state: text }))}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.pincodePlaceholder}
              value={location.pincode}
              onChangeText={(text) => setLocation(prev => ({ ...prev, pincode: text }))}
              keyboardType="numeric"
              maxLength={6}
            />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleManualSubmit}
              >
                <Text style={styles.primaryButtonText}>{t.continue}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={onSkip}
              >
                <Text style={styles.skipButtonText}>{t.skip}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  benefitsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#999',
    fontSize: 16,
  },
  formContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 54,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
}); 