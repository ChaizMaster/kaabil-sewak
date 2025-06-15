import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../../context/LanguageContext';

type AuthStackParamList = {
  OtpVerification: { mobileNumber: string; name?: string; businessName?: string; city?: string };
  PhotoUpload: { name?: string; businessName?: string; mobileNumber?: string; city?: string };
};

type OtpNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'OtpVerification'
>;
type OtpRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

const translations = {
  english: {
    title: 'Verify Your Number',
    subtitle: 'Enter the 6-digit code sent to',
    verify: 'Verify & Proceed',
    resendText: "Didn't receive code?",
    resend: 'Resend Code',
    resendIn: 'Resend in',
    back: 'Back',
    incompleteOtp: 'Incomplete Code',
    incompleteOtpMsg: 'Please enter all 6 digits of the code.',
    verificationSuccess: 'Verification Successful!',
    welcomeMsg: 'Welcome! Your number is verified.',
    verificationFailed: 'Verification Failed',
    invalidOtpMsg: 'The code entered is incorrect. Please try again.',
    networkError: 'Network Error',
    networkErrorMsg: 'Please check your connection and try again.',
    otpResent: 'New Code Sent!',
    otpResentMsg: 'A new verification code has been sent.',
    failedToResend: 'Failed to Resend Code',
  },
  hindi: {
    title: 'अपना नंबर सत्यापित करें',
    subtitle: 'भेजा गया 6-अंकीय कोड दर्ज करें',
    verify: 'सत्यापित करें और आगे बढ़ें',
    resendText: 'कोड प्राप्त नहीं हुआ?',
    resend: 'कोड पुनः भेजें',
    resendIn: 'में पुनः भेजें',
    back: 'वापस',
    incompleteOtp: 'अधूरा कोड',
    incompleteOtpMsg: 'कृपया कोड के सभी 6 अंक दर्ज करें।',
    verificationSuccess: 'सत्यापन सफल!',
    welcomeMsg: 'स्वागत है! आपका नंबर सत्यापित है।',
    verificationFailed: 'सत्यापन विफल',
    invalidOtpMsg: 'दर्ज किया गया कोड गलत है। कृपया पुनः प्रयास करें।',
    networkError: 'नेटवर्क त्रुटि',
    networkErrorMsg: 'कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।',
    otpResent: 'नया कोड भेजा गया!',
    otpResentMsg: 'एक नया सत्यापन कोड भेजा गया है।',
    failedToResend: 'कोड पुनः भेजने में विफल',
  },
  bengali: {
    title: 'আপনার নম্বর যাচাই করুন',
    subtitle: 'পাঠানো ৬-সংখ্যার কোডটি প্রবেশ করান',
    verify: 'যাচাই করুন এবং এগিয়ে যান',
    resendText: 'কোড পাননি?',
    resend: 'কোড আবার পাঠান',
    resendIn: 'পুনরায় পাঠান',
    back: 'ফিরে যান',
    incompleteOtp: 'অসম্পূর্ণ কোড',
    incompleteOtpMsg: 'অনুগ্রহ করে কোডের সব ৬টি সংখ্যা প্রবেশ করান।',
    verificationSuccess: 'যাচাইকরণ সফল!',
    welcomeMsg: 'স্বাগতম! আপনার নম্বর যাচাই করা হয়েছে।',
    verificationFailed: 'যাচাইকরণ ব্যর্থ',
    invalidOtpMsg: 'প্রবেশ করা কোডটি ভুল। অনুগ্রহ করে আবার চেষ্টা করুন।',
    networkError: 'নেটওয়ার্ক ত্রুটি',
    networkErrorMsg: 'অনুগ্রহ করে আপনার সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
    otpResent: 'নতুন কোড পাঠানো হয়েছে!',
    otpResentMsg: 'একটি নতুন যাচাইকরণ কোড পাঠানো হয়েছে।',
    failedToResend: 'কোড আবার পাঠাতে ব্যর্থ হয়েছে',
  },
};

const RESEND_TIMEOUT_SECONDS = 60;

const OtpVerificationScreen = () => {
  const navigation = useNavigation<OtpNavigationProp>();
  const route = useRoute<OtpRouteProp>();
  const { mobileNumber, name, businessName, city } = route.params;
  const { language } = useLanguage();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const t = translations[language];

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    if (!canResend && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [canResend, resendTimer]);

  const formatPhoneDisplay = (number: string) => {
    if (number.length !== 10) return number;
    return `${number.slice(0, 5)} ${number.slice(5, 10)}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value) && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '') && index === 5) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<TextInput>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCodeParam?: string) => {
    const codeToVerify = otpCodeParam || otp.join('');
    if (codeToVerify.length !== 6) {
      Alert.alert(t.incompleteOtp, t.incompleteOtpMsg);
      return;
    }

    setIsVerifying(true);
    setLoading(true);

    // Mock verification
    setTimeout(() => {
      setIsVerifying(false);
      setLoading(false);
      // Simple mock: any OTP ending in '7' fails
      if (codeToVerify.endsWith('7')) {
        Alert.alert(t.verificationFailed, t.invalidOtpMsg);
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert(t.verificationSuccess, t.welcomeMsg, [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('PhotoUpload', { name, businessName, mobileNumber, city }),
          },
        ]);
      }
    }, 1500);
  };

  const handleResendOTP = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    // Mock resend
    setTimeout(() => {
      setLoading(false);
      Alert.alert(t.otpResent, t.otpResentMsg);
      setOtp(Array(6).fill(''));
      setCanResend(false);
      setResendTimer(RESEND_TIMEOUT_SECONDS);
      inputRefs.current[0]?.focus();
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
              <Text style={styles.subtitle}>
                {t.subtitle}{' '}
                <Text style={styles.phoneNumberDisplay}>
                  +91 {formatPhoneDisplay(mobileNumber)}
                </Text>
              </Text>
            </View>

            <View style={styles.otpSection}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      inputRefs.current[index]?.isFocused() &&
                        styles.otpInputFocused,
                      digit ? styles.otpInputFilled : null,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e: any) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    autoFocus={index === 0}
                    selectionColor={'#F055A8'}
                    textContentType="oneTimeCode"
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[styles.verifyButton, (loading || isVerifying) && styles.verifyButtonDisabled]}
              onPress={() => handleVerifyOTP()}
              disabled={loading || isVerifying}
              activeOpacity={0.75}
            >
              {loading || isVerifying ? (
                <ActivityIndicator color="#F0F4F8" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>{t.verify}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendInfoText}>{t.resendText}</Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={!canResend || loading}
              >
                <Text
                  style={[
                    styles.resendButtonText,
                    !canResend && styles.disabledText,
                  ]}
                >
                  {canResend
                    ? t.resend
                    : `${t.resendIn} ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>

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
    paddingHorizontal: 20,
  },
  phoneNumberDisplay: {
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  otpSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#2D3748',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F0F4F8',
    backgroundColor: '#1A2942',
  },
  otpInputFocused: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  otpInputFilled: {
    borderColor: '#4A5568',
  },
  footerActions: {
    paddingBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: '#1E40AF',
  },
  verifyButtonText: {
    color: '#F0F4F8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendInfoText: {
    color: '#A0AEC0',
    fontSize: 15,
  },
  resendButtonText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  disabledText: {
    color: '#4A5568',
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

export default OtpVerificationScreen; 