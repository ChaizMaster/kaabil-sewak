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
import authService from '../../services/authService';

interface OTPScreenProps {
  phoneNumber: string;
  onVerificationSuccess: () => void;
  onGoBack: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    title: 'Verify Your Number',
    subtitle: 'Enter the 6-digit code sent to',
    otpLabel: 'Enter 6-digit code',
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
    otpLabel: '6-अंकीय कोड दर्ज करें',
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
    otpLabel: '৬-সংখ্যার কোড দিন',
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

export const OTPScreen: React.FC<OTPScreenProps> = ({
  phoneNumber,
  onVerificationSuccess,
  onGoBack,
  language,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT_SECONDS);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const t = translations[language];

  useEffect(() => {
    let timerId: NodeJS.Timeout;
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
    if (number.length === 0) return '';
    if (number.length <= 5) return number;
    if (number.length <= 10) return `${number.slice(0, 5)} ${number.slice(5)}`;
    return `${number.slice(0, 5)} ${number.slice(5,10)}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && value.length === 1 && index === 5) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<TextInput>, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const prevOtp = [...otp];
        prevOtp[index - 1] = '';
        setOtp(prevOtp);
      }
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
    try {
      const result = await authService.verifyOTP(codeToVerify);
      if (result.success && result.user) {
        Alert.alert(
          t.verificationSuccess,
          t.welcomeMsg,
          [{ text: 'OK', onPress: onVerificationSuccess }]
        );
      } else {
        Alert.alert(t.verificationFailed, result.error || t.invalidOtpMsg);
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      Alert.alert(t.networkError, error.message || t.networkErrorMsg);
    } finally {
      setIsVerifying(false);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    try {
      const result = await authService.sendOTP(phoneNumber);
      if (result.success) {
        Alert.alert(t.otpResent, t.otpResentMsg);
        setOtp(Array(6).fill(''));
        setCanResend(false);
        setResendTimer(RESEND_TIMEOUT_SECONDS);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert(t.failedToResend, result.error || 'Please try again later.');
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
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
              <Text style={styles.subtitle}>
                {t.subtitle} <Text style={styles.phoneNumberDisplay}>+91 {formatPhoneDisplay(phoneNumber)}</Text>
              </Text>
            </View>

            <View style={styles.otpSection}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={[
                      styles.otpInput,
                      inputRefs.current[index]?.isFocused() ? styles.otpInputFocused : null,
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
                    autoComplete="sms-otp"
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
              {(loading || isVerifying) ? (
                <ActivityIndicator color="#F0F4F8" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>{t.verify}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendInfoText}>{t.resendText} </Text>
              {canResend ? (
                <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                  <Text style={[styles.resendLinkText, loading && styles.disabledText]}>{t.resend}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimerText}>
                  {t.resendIn} {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:{String(resendTimer % 60).padStart(2, '0')}
                </Text>
              )}
            </View>
            
            <TouchableOpacity onPress={onGoBack} style={styles.backButton} disabled={loading || isVerifying}>
              <MaterialIcons name="arrow-back-ios" size={16} color="#A0AEC0" style={styles.backIcon}/>
              <Text style={[styles.backButtonText, (loading || isVerifying) && styles.disabledText]}>{t.back}</Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
    lineHeight: 24,
  },
  phoneNumberDisplay: {
    color: '#F0F4F8',
    fontWeight: '600',
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 360,
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: 'rgba(23, 42, 70, 0.65)',
    color: '#F0F4F8',
    fontSize: 24,
    fontWeight: 'bold',
    height: 60,
    width: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.25)',
    marginHorizontal: 6,
  },
  otpInputFocused: {
    borderColor: '#F055A8',
    backgroundColor: 'rgba(23, 42, 70, 0.8)',
  },
  otpInputFilled: {
    borderColor: '#304FFE',
    backgroundColor: 'rgba(23, 42, 70, 0.9)',
  },
  footerActions: {
     alignItems: 'center',
     paddingBottom: 10,
  },
  verifyButton: {
    backgroundColor: 'rgba(48, 79, 254, 0.8)',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 60,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.35)',
    marginBottom: 25,
  },
  verifyButtonDisabled: {
    backgroundColor: 'rgba(48, 79, 254, 0.45)',
  },
  verifyButtonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resendInfoText: {
    fontSize: 15,
    color: '#A0AEC0',
  },
  resendLinkText: {
    fontSize: 15,
    color: '#F055A8',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  resendTimerText: {
    fontSize: 15,
    color: '#A0AEC0',
    fontWeight: '600',
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
  disabledText: {
    color: 'rgba(160, 174, 192, 0.5)',
  },
}); 