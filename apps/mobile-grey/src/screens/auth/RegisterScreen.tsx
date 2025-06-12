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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../../context/LanguageContext';

type AuthStackParamList = {
  Register: undefined;
  OtpVerification: { mobileNumber: string; name: string; businessName: string; city: string };
};

type RegisterNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

const translations = {
  english: {
    title: 'Create Your Business Account',
    subtitle: 'Join us to find the best talent for your needs',
    yourName: 'Your Name',
    yourNamePlaceholder: 'E.g., Ramesh Kumar',
    businessName: 'Business Name',
    businessNamePlaceholder: 'E.g., Ramesh Construction',
    phoneNumber: 'Mobile Number',
    phonePlaceholder: '98765 43210',
    city: 'Your City',
    cityPlaceholder: 'E.g., Mumbai',
    sendOtp: 'Verify & Continue',
    termsText: 'By continuing, you agree to our Terms & Privacy Policy',
    requiredField: 'This field is required',
    nameRequired: 'Your Name is required',
    businessNameRequired: 'Business Name is required',
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
    title: 'अपना व्यावसायिक खाता बनाएं',
    subtitle: 'अपनी जरूरतों के लिए सर्वश्रेष्ठ प्रतिभा खोजने के लिए हमसे जुड़ें',
    yourName: 'आपका नाम',
    yourNamePlaceholder: 'जैसे, रमेश कुमार',
    businessName: 'व्यवसाय का नाम',
    businessNamePlaceholder: 'जैसे, रमेश कंस्ट्रक्शन',
    phoneNumber: 'मोबाइल नंबर',
    phonePlaceholder: '98765 43210',
    city: 'आपका शहर',
    cityPlaceholder: 'जैसे, मुंबई',
    sendOtp: 'सत्यापित करें और जारी रखें',
    termsText: 'जारी रखकर, आप हमारी शर्तों और गोपनीयता नीति से सहमत हैं',
    requiredField: 'यह फ़ील्ड आवश्यक है',
    nameRequired: 'आपका नाम आवश्यक है',
    businessNameRequired: 'व्यवसाय का नाम आवश्यक है',
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
    title: 'আপনার ব্যবসায়িক অ্যাকাউন্ট তৈরি করুন',
    subtitle: 'আপনার প্রয়োজনের জন্য সেরা প্রতিভা খুঁজে পেতে আমাদের সাথে যোগ দিন',
    yourName: 'আপনার নাম',
    yourNamePlaceholder: 'যেমন, রমেশ কুমার',
    businessName: 'ব্যবসার নাম',
    businessNamePlaceholder: 'যেমন, রমেশ কনস্ট্রাকশন',
    phoneNumber: 'মোবাইল নম্বর',
    phonePlaceholder: '98765 43210',
    city: 'আপনার শহর',
    cityPlaceholder: 'যেমন, মুম্বাই',
    sendOtp: 'যাচাই করুন এবং চালিয়ে যান',
    termsText: 'চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হন',
    requiredField: 'এই ক্ষেত্রটি প্রয়োজনীয়',
    nameRequired: 'আপনার নাম প্রয়োজন',
    businessNameRequired: 'ব্যবসার নাম প্রয়োজন',
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

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    yourName: '',
    businessName: '',
    phoneNumber: '',
    city: '',
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
    return `${number.slice(0, 5)} ${number.slice(5, 10)}`;
  };

  const validateForm = () => {
    if (!formData.yourName.trim()) {
      Alert.alert(t.nameRequired, t.requiredField);
      return false;
    }
    if (!formData.businessName.trim()) {
      Alert.alert(t.businessNameRequired, t.requiredField);
      return false;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      Alert.alert(
        formData.phoneNumber ? t.invalidPhone : t.phoneRequired,
        formData.phoneNumber ? t.invalidPhoneMsg : t.requiredField
      );
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
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t.otpSent,
        `Verification code sent to +91 ${formatPhoneDisplay(
          formData.phoneNumber
        )}`,
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('OtpVerification', {
                mobileNumber: formData.phoneNumber,
                name: formData.yourName,
                businessName: formData.businessName,
                city: formData.city,
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
                <Text style={styles.inputLabel}>{t.yourName}</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.yourName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, yourName: text })
                  }
                  placeholder={t.yourNamePlaceholder}
                  placeholderTextColor="rgba(160, 174, 192, 0.6)"
                  autoCapitalize="words"
                  returnKeyType="next"
                  selectionColor={'#F055A8'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.businessName}</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.businessName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, businessName: text })
                  }
                  placeholder={t.businessNamePlaceholder}
                  placeholderTextColor="rgba(160, 174, 192, 0.6)"
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
                    placeholderTextColor="rgba(160, 174, 192, 0.6)"
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
                  onChangeText={(text) =>
                    setFormData({ ...formData, city: text })
                  }
                  placeholder={t.cityPlaceholder}
                  placeholderTextColor="rgba(160, 174, 192, 0.6)"
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
  },
  mainFormContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A0AEC0',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1A2942',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#F0F4F8',
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#1A2942',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  countryCode: {
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderColor: '#2D3748',
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
  footerActions: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
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
    marginBottom: 16,
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

export default RegisterScreen;

 