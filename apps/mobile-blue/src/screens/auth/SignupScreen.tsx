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
import { MaterialIcons } from '@expo/vector-icons';
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
    subtitle: 'Join us to find better job opportunities',
    fullName: 'Full Name',
    fullNamePlaceholder: 'E.g., Ramesh Kumar',
    phoneNumber: 'Mobile Number',
    phonePlaceholder: '98765 43210',
    city: 'Your City',
    cityPlaceholder: 'E.g., Mumbai',
    sendOtp: 'Verify & Continue',
    termsText: 'By continuing, you agree to our Terms & Privacy Policy',
    requiredField: 'This field is required',
    nameRequired: 'Full Name Required',
    phoneRequired: 'Mobile Number Required',
    cityRequired: 'City Required',
    invalidPhone: 'Invalid Mobile Number',
    invalidPhoneMsg: 'Please enter a valid 10-digit Indian mobile number.',
    back: 'Back',
    otpSent: 'OTP Sent!',
    failedToSend: 'Failed to Send OTP',
    networkError: 'Network Error',
    networkErrorMsg: 'Please check your internet connection and try again.',
  },
  hindi: {
    title: 'अपना खाता बनाएं',
    subtitle: 'बेहतर नौकरी के अवसर पाने के लिए हमसे जुड़ें',
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'जैसे, रमेश कुमार',
    phoneNumber: 'मोबाइल नंबर',
    phonePlaceholder: '98765 43210',
    city: 'आपका शहर',
    cityPlaceholder: 'जैसे, मुंबई',
    sendOtp: 'सत्यापित करें और जारी रखें',
    termsText: 'जारी रखकर, आप हमारी शर्तों और गोपनीयता नीति से सहमत हैं',
    requiredField: 'यह फ़ील्ड आवश्यक है',
    nameRequired: 'पूरा नाम आवश्यक है',
    phoneRequired: 'मोबाइल नंबर आवश्यक है',
    cityRequired: 'शहर आवश्यक है',
    invalidPhone: 'अमान्य मोबाइल नंबर',
    invalidPhoneMsg: 'कृपया एक मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।',
    back: 'वापस',
    otpSent: 'OTP भेजा गया!',
    failedToSend: 'OTP भेजने में विफल',
    networkError: 'नेटवर्क त्रुटि',
    networkErrorMsg: 'कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
  },
  bengali: {
    title: 'আপনার অ্যাকাউন্ট তৈরি করুন',
    subtitle: 'আরও ভাল চাকরির সুযোগ পেতে আমাদের সাথে যোগ দিন',
    fullName: 'পুরো নাম',
    fullNamePlaceholder: 'যেমন, রমেশ কুমার',
    phoneNumber: 'মোবাইল নম্বর',
    phonePlaceholder: '98765 43210',
    city: 'আপনার শহর',
    cityPlaceholder: 'যেমন, মুম্বাই',
    sendOtp: 'যাচাই করুন এবং চালিয়ে যান',
    termsText: 'চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হন',
    requiredField: 'এই ক্ষেত্রটি প্রয়োজনীয়',
    nameRequired: 'পুরো নাম প্রয়োজন',
    phoneRequired: 'মোবাইল নম্বর প্রয়োজন',
    cityRequired: 'শহর প্রয়োজন',
    invalidPhone: 'অবৈধ মোবাইল নম্বর',
    invalidPhoneMsg: 'অনুগ্রহ করে একটি বৈধ ১০-সংখ্যার ভারতীয় মোবাইল নম্বর প্রবেশ করান।',
    back: 'ফিরে যান',
    otpSent: 'OTP পাঠানো হয়েছে!',
    failedToSend: 'OTP পাঠাতে ব্যর্থ হয়েছে',
    networkError: 'নেটওয়ার্ক ত্রুটি',
    networkErrorMsg: 'অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
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
    const cleaned = text.replace(/[^0-9]/g, '');
    setFormData({ ...formData, phoneNumber: cleaned });
  };

  const formatPhoneDisplay = (number: string) => {
    if (number.length === 0) return '';
    if (number.length <= 5) return number;
    if (number.length <= 10) return `${number.slice(0, 5)} ${number.slice(5)}`;
    return `${number.slice(0, 5)} ${number.slice(5,10)}`;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert(t.nameRequired, t.requiredField);
      return false;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      Alert.alert(
        formData.phoneNumber ? t.invalidPhone : t.phoneRequired,
        formData.phoneNumber ? t.invalidPhoneMsg : t.requiredField
      );
      return false;
    }
    if (!authService.validateIndianPhoneNumber(formData.phoneNumber)) {
      Alert.alert(t.invalidPhone, t.invalidPhoneMsg);
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert(t.cityRequired, t.requiredField);
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
          t.otpSent,
          `Verification code sent to +91 ${formatPhoneDisplay(formData.phoneNumber)}`,
          [{ text: 'OK', onPress: () => onNavigateToOTP(formData.phoneNumber, formData) }]
        );
      } else {
        Alert.alert(t.failedToSend, result.error || 'Please try again later.');
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
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainFormContainer}> 
            <View style={styles.header}>
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.subtitle}>{t.subtitle}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.fullName}</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                  placeholder={t.fullNamePlaceholder}
                  placeholderTextColor='rgba(160, 174, 192, 0.6)'
                  autoCapitalize="words"
                  returnKeyType="next"
                  selectionColor={'#F055A8'}
                />
              </View>

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
                    placeholderTextColor='rgba(160, 174, 192, 0.6)'
                    keyboardType="phone-pad"
                    maxLength={13}
                    returnKeyType="next"
                    selectionColor={'#F055A8'}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.city}</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholder={t.cityPlaceholder}
                  placeholderTextColor='rgba(160, 174, 192, 0.6)'
                  autoCapitalize="words"
                  returnKeyType="done"
                  selectionColor={'#F055A8'}
                />
              </View>
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
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: { 
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  mainFormContainer: {
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
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
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A0AEC0',
    marginBottom: 10,
  },
  textInput: { 
    backgroundColor: 'rgba(23, 42, 70, 0.65)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.25)',
    paddingHorizontal: 20,
    fontSize: 17,
    color: '#F0F4F8',
    height: 60,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(23, 42, 70, 0.65)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.25)',
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: 60,
  },
  countryCode: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(240, 244, 248, 0.25)',
    height: '55%',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 17,
    color: '#F0F4F8',
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    color: '#F0F4F8',
    paddingLeft: 14,
  },
  footerActions: {
     alignItems: 'center',
     paddingBottom: 10, 
  },
  sendButton: {
    backgroundColor: 'rgba(48, 79, 254, 0.8)',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 60,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.35)',
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(48, 79, 254, 0.45)',
  },
  sendButtonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(160, 174, 192, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10, 
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backIcon: {
    marginRight: 6,
  },
  backButtonText: {
    fontSize: 15,
    color: '#A0AEC0',
    fontWeight: '500',
  },
});

export type { SignupData }; 