import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import authService from '../../services/authService';

interface SignupScreenProps {
  onNavigateToOTP: (phoneNumber: string, signupData: SignupData) => void;
  onGoBack: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

interface SignupData {
  fullName: string;
  phoneNumber: string;
  city: string;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    title: 'Create Your Account',
    subtitle: 'Join thousands of workers finding better jobs',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    phoneNumber: 'Mobile Number',
    phonePlaceholder: '98765 43210',
    city: 'Your City',
    cityPlaceholder: 'Enter your city',
    sendOtp: 'Send OTP',
    termsText: 'By continuing, you agree to our Terms of Service and Privacy Policy',
    requiredField: 'This field is required',
    invalidPhone: 'Please enter a valid Indian mobile number',
    back: '← Back',
  },
  hindi: {
    title: 'अपना खाता बनाएं',
    subtitle: 'हजारों मजदूरों से जुड़ें जो बेहतर काम पा रहे हैं',
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'अपना पूरा नाम लिखें',
    phoneNumber: 'मोबाइल नंबर',
    phonePlaceholder: '98765 43210',
    city: 'आपका शहर',
    cityPlaceholder: 'अपना शहर लिखें',
    sendOtp: 'OTP भेजें',
    termsText: 'जारी रखने से आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं',
    requiredField: 'यह फील्ड आवश्यक है',
    invalidPhone: 'कृपया एक वैध भारतीय मोबाइल नंबर दर्ज करें',
    back: '← वापस',
  },
  bengali: {
    title: 'আপনার অ্যাকাউন্ট তৈরি করুন',
    subtitle: 'হাজার হাজার শ্রমিকের সাথে যোগ দিন যারা ভাল কাজ খুঁজে পাচ্ছেন',
    fullName: 'পূর্ণ নাম',
    fullNamePlaceholder: 'আপনার পূর্ণ নাম লিখুন',
    phoneNumber: 'মোবাইল নম্বর',
    phonePlaceholder: '98765 43210',
    city: 'আপনার শহর',
    cityPlaceholder: 'আপনার শহর লিখুন',
    sendOtp: 'OTP পাঠান',
    termsText: 'চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হন',
    requiredField: 'এই ক্ষেত্রটি প্রয়োজনীয়',
    invalidPhone: 'দয়া করে একটি বৈধ ভারতীয় মোবাইল নম্বর দিন',
    back: '← ফিরে যান',
  },
};

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onNavigateToOTP,
  onGoBack,
  language,
}) => {
  const [formData, setFormData] = useState<SignupData>({
    fullName: '',
    phoneNumber: '',
    city: '',
    language: language,
  });
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  const handlePhoneNumberChange = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    setFormData({ ...formData, phoneNumber: cleaned });
  };

  const formatPhoneDisplay = (number: string) => {
    // Format for display: 98765 43210
    if (number.length <= 5) return number;
    return `${number.slice(0, 5)} ${number.slice(5)}`;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Full Name Required', t.requiredField);
      return false;
    }

    if (!formData.phoneNumber) {
      Alert.alert('Phone Number Required', t.requiredField);
      return false;
    }

    if (!authService.validateIndianPhoneNumber(formData.phoneNumber)) {
      Alert.alert('Invalid Phone Number', t.invalidPhone);
      return false;
    }

    if (!formData.city.trim()) {
      Alert.alert('City Required', t.requiredField);
      return false;
    }

    return true;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await authService.sendOTP(formData.phoneNumber);
      
      if (result.success) {
        Alert.alert(
          'OTP Sent!',
          `Verification code sent to +91 ${formatPhoneDisplay(formData.phoneNumber)}`,
          [{ text: 'OK', onPress: () => onNavigateToOTP(formData.phoneNumber, formData) }]
        );
      } else {
        Alert.alert('Failed to Send OTP', result.error || 'Please try again');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Network Error', 'Please check your internet connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.subtitle}>{t.subtitle}</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.fullName}</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                  placeholder={t.fullNamePlaceholder}
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.phoneNumber}</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    value={formatPhoneDisplay(formData.phoneNumber)}
                    onChangeText={handlePhoneNumberChange}
                    placeholder={t.phonePlaceholder}
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    maxLength={11} // 5 + space + 5
                  />
                </View>
              </View>

              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.city}</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholder={t.cityPlaceholder}
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendButtonText}>{t.sendOtp}</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>{t.termsText}</Text>

            {/* Back Button */}
            <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
    lineHeight: 22,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f1f3f4',
    borderRightWidth: 1,
    borderRightColor: '#e1e5e9',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
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
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export type { SignupData }; 