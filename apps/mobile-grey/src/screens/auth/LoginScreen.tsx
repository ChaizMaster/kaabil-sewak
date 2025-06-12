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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../../context/LanguageContext';

type AuthStackParamList = {
  Login: undefined;
  OtpVerification: { mobileNumber: string; name?: string; businessName?: string };
  LanguageSelection: undefined;
};

type LoginNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

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

const LoginScreen = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handlePhoneNumberChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setMobileNumber(cleaned);
  };

  const formatPhoneDisplay = (number: string) => {
    if (number.length === 0) return '';
    if (number.length <= 5) return number;
    if (number.length <= 10) return `${number.slice(0, 5)} ${number.slice(5)}`;
    return `${number.slice(0, 5)} ${number.slice(5, 10)}`;
  };

  const validateInput = () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert(
        mobileNumber ? t.invalidPhone : t.phoneRequired,
        mobileNumber ? t.invalidPhoneMsg : t.phoneRequiredMsg
      );
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateInput()) return;

    setLoading(true);
    // Mock OTP sending
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t.otpSent,
        `${t.otpSentMsg} ${formatPhoneDisplay(mobileNumber)}`,
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('OtpVerification', {
                mobileNumber: mobileNumber,
                name: 'User', // For existing users, we'll use 'User' as default since we don't collect name during login
                businessName: '', // Empty for login users
              }),
          },
        ]
      );
    }, 1000);
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
                  value={formatPhoneDisplay(mobileNumber)}
                  onChangeText={handlePhoneNumberChange}
                  placeholder={t.phonePlaceholder}
                  placeholderTextColor="rgba(160, 174, 192, 0.6)"
                  keyboardType="phone-pad"
                  maxLength={13}
                  autoFocus
                  selectionColor={'#F055A8'}
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

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons
                name="arrow-back-ios"
                size={16}
                color="#A0AEC0"
                style={styles.backIcon}
              />
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
  scrollContentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A0AEC0',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
    height: 48,
  },
  countryCode: {
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderColor: '#2D3748',
    height: 48,
    justifyContent: 'center',
  },
  countryCodeText: {
    color: '#F0F4F8',
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    color: '#F0F4F8',
    fontSize: 16,
  },
  helperText: {
    marginTop: 8,
    fontSize: 13,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  footerActions: {
    paddingBottom: 20,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#1E40AF',
  },
  sendButtonText: {
    color: '#F0F4F8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  backIcon: {
    marginRight: 4,
  },
  backButtonText: {
    fontSize: 15,
    color: '#A0AEC0',
    fontWeight: '500',
  },
});

export default LoginScreen;
