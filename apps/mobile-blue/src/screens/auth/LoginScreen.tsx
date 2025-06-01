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
import { MaterialIcons } from '@expo/vector-icons';
import authService from '../../services/authService';

interface LoginScreenProps {
  onNavigateToOTP: (phoneNumber: string) => void;
  onGoBack: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    title: 'Welcome Back!',
    subtitle: 'Sign in with your mobile number',
    phoneNumber: 'Mobile Number',
    phonePlaceholder: '98765 43210',
    sendOtp: 'Send OTP',
    helperText: "We'll send a 6-digit code to verify",
    termsText: 'By continuing, you agree to our Terms & Privacy Policy',
    back: 'Back',
    phoneRequired: 'Phone Number Required',
    phoneRequiredMsg: 'Please enter your 10-digit mobile number.',
    invalidPhone: 'Invalid Mobile Number',
    invalidPhoneMsg: 'Please enter a valid 10-digit Indian mobile number.',
    otpSent: 'OTP Sent!',
    otpSentMsg: 'Verification code sent to +91',
    failedToSend: 'Failed to Send OTP',
    networkError: 'Network Error',
    networkErrorMsg: 'Please check your internet connection and try again.',
  },
  hindi: {
    title: 'वापस स्वागत है!',
    subtitle: 'अपने मोबाइल नंबर से साइन इन करें',
    phoneNumber: 'मोबाइल नंबर',
    phonePlaceholder: '98765 43210',
    sendOtp: 'OTP भेजें',
    helperText: 'हम पुष्टि के लिए 6-अंकीय कोड भेजेंगे',
    termsText: 'जारी रखकर, आप हमारी शर्तों और गोपनीयता नीति से सहमत हैं',
    back: 'वापस',
    phoneRequired: 'मोबाइल नंबर आवश्यक',
    phoneRequiredMsg: 'कृपया अपना 10-अंकीय मोबाइल नंबर दर्ज करें।',
    invalidPhone: 'अमान्य मोबाइल नंबर',
    invalidPhoneMsg: 'कृपया एक मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।',
    otpSent: 'OTP भेजा गया!',
    otpSentMsg: 'सत्यापन कोड भेजा गया +91',
    failedToSend: 'OTP भेजने में विफल',
    networkError: 'नेटवर्क त्रुटि',
    networkErrorMsg: 'कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
  },
  bengali: {
    title: 'আবার স্বাগতম!',
    subtitle: 'আপনার মোবাইল নম্বর দিয়ে সাইন ইন করুন',
    phoneNumber: 'মোবাইল নম্বর',
    phonePlaceholder: '98765 43210',
    sendOtp: 'OTP পাঠান',
    helperText: 'আমরা যাচাই করার জন্য একটি ৬-সংখ্যার কোড পাঠাব',
    termsText: 'চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হন',
    back: 'ফিরে যান',
    phoneRequired: 'মোবাইল নম্বর প্রয়োজন',
    phoneRequiredMsg: 'অনুগ্রহ করে আপনার ১০-সংখ্যার মোবাইল নম্বর প্রবেশ করান।',
    invalidPhone: 'অবৈধ মোবাইল নম্বর',
    invalidPhoneMsg: 'অনুগ্রহ করে একটি বৈধ ১০-সংখ্যার ভারতীয় মোবাইল নম্বর প্রবেশ করান।',
    otpSent: 'OTP পাঠানো হয়েছে!',
    otpSentMsg: 'যাচাইকরণ কোড পাঠানো হয়েছে +91',
    failedToSend: 'OTP পাঠাতে ব্যর্থ',
    networkError: 'নেটওয়ার্ক ত্রুটি',
    networkErrorMsg: 'অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
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
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleaned);
  };

  const formatPhoneDisplay = (number: string) => {
    if (number.length === 0) return '';
    if (number.length <= 5) return number;
    if (number.length <= 10) return `${number.slice(0, 5)} ${number.slice(5)}`;
    return `${number.slice(0, 5)} ${number.slice(5,10)}`; // Max 10 digits for display format
  };

  const validateInput = () => {
    if (!phoneNumber || phoneNumber.length !== 10) { // Check for exactly 10 digits
      Alert.alert(
        phoneNumber ? t.invalidPhone : t.phoneRequired, 
        phoneNumber ? t.invalidPhoneMsg : t.phoneRequiredMsg
      );
      return false;
    }
    // authService.validateIndianPhoneNumber might be redundant if we ensure 10 digits
    // but keeping it if it has other specific checks (e.g. starting digits)
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
        // Alert is okay for now, but Instagram-like UX might use a toast/snackbar
        Alert.alert(
          t.otpSent,
          `${t.otpSentMsg} ${formatPhoneDisplay(phoneNumber)}`,
          [{ text: 'OK', onPress: () => onNavigateToOTP(phoneNumber) }]
        );
      } else {
        Alert.alert(t.failedToSend, result.error || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      Alert.alert(t.networkError, error.message || t.networkErrorMsg);
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
        <View style={styles.scrollContentContainer}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.subtitle}>{t.subtitle}</Text>
            </View>

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
                  placeholderTextColor='rgba(160, 174, 192, 0.6)' // Slightly more subtle placeholder
                  keyboardType="phone-pad"
                  maxLength={13} // 10 digits + 2 spaces + country code part for display (actual value is 10)
                  autoFocus
                  selectionColor={'#F055A8'} // Radiant Orchid cursor
                />
              </View>
              <Text style={styles.helperText}>{t.helperText}</Text>
            </View>
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
              activeOpacity={0.75}
            >
              {loading ? (
                <ActivityIndicator color="#F0F4F8" size="small" />
              ) : (
                <Text style={styles.sendButtonText}>{t.sendOtp}</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.termsText}>{t.termsText}</Text>
            
            <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
              <MaterialIcons name="arrow-back-ios" size={16} color="#A0AEC0" style={styles.backIcon}/>
              <Text style={styles.backButtonText}>{t.back}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContentContainer: { // To better manage keyboard and content
    flex: 1,
    justifyContent: 'space-between', // Push footer actions down
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  mainContent: { // Groups header and input
    flexGrow: 1,
    justifyContent: 'center', // Center this block
  },
  header: {
    alignItems: 'center',
    marginBottom: 30, // Reduced margin
  },
  title: {
    fontSize: 30, // Slightly larger title
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17, // Adjusted size
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 10, // For wrapping
  },
  inputSection: {
    marginBottom: 20, // Reduced margin
  },
  inputLabel: {
    fontSize: 15, // Adjusted size
    fontWeight: '600',
    color: '#A0AEC0',
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(23, 42, 70, 0.65)', // Slightly more opaque
    borderRadius: 18, // Larger radius
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.25)', 
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: 18, // Adjusted padding
    height: 60, // Increased height
  },
  countryCode: {
    paddingRight: 12, 
    borderRightWidth: 1,
    borderRightColor: 'rgba(240, 244, 248, 0.25)',
    height: '55%', // Adjusted height
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 17, // Adjusted size
    color: '#F0F4F8',
  },
  phoneInput: {
    flex: 1,
    fontSize: 17, // Adjusted size
    color: '#F0F4F8',
    paddingLeft: 14, 
  },
  helperText: {
    fontSize: 13, // Adjusted size
    color: 'rgba(160, 174, 192, 0.8)', // Cool Gray, slightly more opaque
    marginTop: 12,
    textAlign: 'center',
  },
  footerActions: { // Groups button, terms, and back link
     alignItems: 'center', // Center items in this container
     paddingBottom: 10, // Space from bottom
  },
  sendButton: {
    backgroundColor: 'rgba(48, 79, 254, 0.8)', // More opaque primary button
    borderRadius: 18, // Consistent radius
    paddingVertical: 18, // Increased padding
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Make button full width
    minHeight: 60, 
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.35)',
    marginBottom: 20, // Space before terms text
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(48, 79, 254, 0.45)',
  },
  sendButtonText: {
    fontSize: 19, // Larger text
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  termsText: {
    fontSize: 12, // Slightly larger terms
    color: 'rgba(160, 174, 192, 0.7)', // Cool Gray with more transparency
    textAlign: 'center',
    lineHeight: 18, // Improved line height
    marginBottom: 20, // Space before back button
    paddingHorizontal: 10, // ensure it doesn't touch edges
  },
  backButton: {
    flexDirection: 'row', // Align icon and text
    alignItems: 'center',
    paddingVertical: 10, // Adjusted padding
  },
  backIcon: {
    marginRight: 6,
  },
  backButtonText: {
    fontSize: 15, // Adjusted size
    color: '#A0AEC0', // Cool Gray for back button
    fontWeight: '500',
  },
}); 