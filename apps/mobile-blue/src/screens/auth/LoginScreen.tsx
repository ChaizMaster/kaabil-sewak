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
} from 'react-native';
import authService from '../../services/authService';

interface LoginScreenProps {
  onNavigateToOTP: (phoneNumber: string) => void;
  onGoBack: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    title: 'Welcome Back!',
    subtitle: 'Sign in to your account',
    phoneNumber: 'Mobile Number',
    phonePlaceholder: '98765 43210',
    sendOtp: 'Send OTP',
    helperText: 'We\'ll send you a 6-digit verification code',
    termsText: 'By continuing, you agree to our Terms of Service and Privacy Policy',
    back: '← Back',
    phoneRequired: 'Phone Number Required',
    phoneRequiredMsg: 'Please enter your phone number',
    invalidPhone: 'Invalid Phone Number',
    invalidPhoneMsg: 'Please enter a valid Indian mobile number',
    otpSent: 'OTP Sent!',
    otpSentMsg: 'Verification code sent to +91',
    failedToSend: 'Failed to Send OTP',
    networkError: 'Network Error',
    networkErrorMsg: 'Please check your internet connection',
  },
  hindi: {
    title: 'वापस स्वागत है!',
    subtitle: 'अपने खाते में लॉग इन करें',
    phoneNumber: 'मोबाइल नंबर',
    phonePlaceholder: '98765 43210',
    sendOtp: 'OTP भेजें',
    helperText: 'हम आपको 6-अंकीय सत्यापन कोड भेजेंगे',
    termsText: 'जारी रखने से आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं',
    back: '← वापस',
    phoneRequired: 'मोबाइल नंबर आवश्यक',
    phoneRequiredMsg: 'कृपया अपना मोबाइल नंबर दर्ज करें',
    invalidPhone: 'गलत मोबाइल नंबर',
    invalidPhoneMsg: 'कृपया एक वैध भारतीय मोबाइल नंबर दर्ज करें',
    otpSent: 'OTP भेजा गया!',
    otpSentMsg: 'सत्यापन कोड भेजा गया +91',
    failedToSend: 'OTP भेजने में विफल',
    networkError: 'नेटवर्क त्रुटि',
    networkErrorMsg: 'कृपया अपना इंटरनेट कनेक्शन जांचें',
  },
  bengali: {
    title: 'আবার স্বাগতম!',
    subtitle: 'আপনার অ্যাকাউন্টে সাইন ইন করুন',
    phoneNumber: 'মোবাইল নম্বর',
    phonePlaceholder: '98765 43210',
    sendOtp: 'OTP পাঠান',
    helperText: 'আমরা আপনাকে ৬-সংখ্যার যাচাইকরণ কোড পাঠাবো',
    termsText: 'চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হন',
    back: '← ফিরে যান',
    phoneRequired: 'মোবাইল নম্বর প্রয়োজন',
    phoneRequiredMsg: 'দয়া করে আপনার মোবাইল নম্বর দিন',
    invalidPhone: 'ভুল মোবাইল নম্বর',
    invalidPhoneMsg: 'দয়া করে একটি বৈধ ভারতীয় মোবাইল নম্বর দিন',
    otpSent: 'OTP পাঠানো হয়েছে!',
    otpSentMsg: 'যাচাইকরণ কোড পাঠানো হয়েছে +91',
    failedToSend: 'OTP পাঠাতে ব্যর্থ',
    networkError: 'নেটওয়ার্ক ত্রুটি',
    networkErrorMsg: 'দয়া করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন',
  },
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onNavigateToOTP, 
  onGoBack, 
  language 
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  const handlePhoneNumberChange = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleaned);
  };

  const formatPhoneDisplay = (number: string) => {
    // Format for display: 98765 43210
    if (number.length <= 5) return number;
    return `${number.slice(0, 5)} ${number.slice(5)}`;
  };

  const validateInput = () => {
    if (!phoneNumber) {
      Alert.alert(t.phoneRequired, t.phoneRequiredMsg);
      return false;
    }

    if (!authService.validateIndianPhoneNumber(phoneNumber)) {
      Alert.alert(t.invalidPhone, t.invalidPhoneMsg);
      return false;
    }

    return true;
  };

  const handleSendOTP = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      const result = await authService.sendOTP(phoneNumber);
      
      if (result.success) {
        Alert.alert(
          t.otpSent,
          `${t.otpSentMsg} ${formatPhoneDisplay(phoneNumber)}`,
          [{ text: 'OK', onPress: () => onNavigateToOTP(phoneNumber) }]
        );
      } else {
        Alert.alert(t.failedToSend, result.error || 'Please try again');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert(t.networkError, t.networkErrorMsg);
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
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>

          {/* Phone Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{t.phoneNumber}</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                value={formatPhoneDisplay(phoneNumber)}
                onChangeText={handlePhoneNumberChange}
                placeholder={t.phonePlaceholder}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={11} // 5 + space + 5
                autoFocus
              />
            </View>
            <Text style={styles.helperText}>
              {t.helperText}
            </Text>
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
          <Text style={styles.termsText}>
            {t.termsText}
          </Text>

          {/* Back Button */}
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t.back}</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 8,
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
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
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