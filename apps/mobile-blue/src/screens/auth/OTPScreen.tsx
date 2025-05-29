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
import authService from '../../services/authService';

interface OTPScreenProps {
  phoneNumber: string;
  onVerificationSuccess: () => void;
  onGoBack: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    title: 'OTP Sent!',
    subtitle: 'Verification code sent',
    otpLabel: 'Enter 6-digit code',
    verify: 'Verify OTP',
    resendText: 'Didn\'t receive the code?',
    resend: 'Resend OTP',
    resendIn: 'Resend in',
    back: '← Change Phone Number',
    incompleteOtp: 'Incomplete OTP',
    incompleteOtpMsg: 'Please enter all 6 digits',
    verificationSuccess: 'Verification Successful!',
    welcomeMsg: 'Welcome to Kaabil Sewak',
    verificationFailed: 'Verification Failed',
    invalidOtpMsg: 'Invalid OTP code',
    networkError: 'Network Error',
    networkErrorMsg: 'Please check your internet connection',
    otpResent: 'OTP Resent!',
    otpResentMsg: 'New verification code sent to +91',
    failedToResend: 'Failed to Resend OTP',
  },
  hindi: {
    title: 'OTP भेजा गया!',
    subtitle: 'सत्यापन कोड भेजा गया',
    otpLabel: '6-अंकीय कोड दर्ज करें',
    verify: 'OTP सत्यापित करें',
    resendText: 'कोड नहीं मिला?',
    resend: 'OTP दोबारा भेजें',
    resendIn: 'दोबारा भेजें',
    back: '← मोबाइल नंबर बदलें',
    incompleteOtp: 'अधूरा OTP',
    incompleteOtpMsg: 'कृपया सभी 6 अंक दर्ज करें',
    verificationSuccess: 'सत्यापन सफल!',
    welcomeMsg: 'काबिल सेवक में आपका स्वागत है',
    verificationFailed: 'सत्यापन विफल',
    invalidOtpMsg: 'गलत OTP कोड',
    networkError: 'नेटवर्क त्रुटि',
    networkErrorMsg: 'कृपया अपना इंटरनेट कनेक्शन जांचें',
    otpResent: 'OTP दोबारा भेजा गया!',
    otpResentMsg: 'नया सत्यापन कोड भेजा गया +91',
    failedToResend: 'OTP दोबारा भेजने में विफल',
  },
  bengali: {
    title: 'OTP পাঠানো হয়েছে!',
    subtitle: 'যাচাইকরণ কোড পাঠানো হয়েছে',
    otpLabel: '৬-সংখ্যার কোড দিন',
    verify: 'OTP যাচাই করুন',
    resendText: 'কোড পাননি?',
    resend: 'OTP আবার পাঠান',
    resendIn: 'আবার পাঠান',
    back: '← মোবাইল নম্বর পরিবর্তন করুন',
    incompleteOtp: 'অসম্পূর্ণ OTP',
    incompleteOtpMsg: 'দয়া করে সব ৬টি সংখ্যা দিন',
    verificationSuccess: 'যাচাইকরণ সফল!',
    welcomeMsg: 'কাবিল সেবকে স্বাগতম',
    verificationFailed: 'যাচাইকরণ ব্যর্থ',
    invalidOtpMsg: 'ভুল OTP কোড',
    networkError: 'নেটওয়ার্ক ত্রুটি',
    networkErrorMsg: 'দয়া করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন',
    otpResent: 'OTP আবার পাঠানো হয়েছে!',
    otpResentMsg: 'নতুন যাচাইকরণ কোড পাঠানো হয়েছে +91',
    failedToResend: 'OTP আবার পাঠাতে ব্যর্থ',
  },
};

export const OTPScreen: React.FC<OTPScreenProps> = ({
  phoneNumber,
  onVerificationSuccess,
  onGoBack,
  language,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const t = translations[language];

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPhoneDisplay = (number: string) => {
    if (number.length <= 5) return number;
    return `${number.slice(0, 5)} ${number.slice(5)}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && value) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Focus previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      Alert.alert(t.incompleteOtp, t.incompleteOtpMsg);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyOTP(code);
      
      if (result.success && result.user) {
        Alert.alert(
          t.verificationSuccess,
          t.welcomeMsg,
          [{ text: 'OK', onPress: () => {
            console.log('Firebase User UID:', result.user?.uid);
            onVerificationSuccess();
          }}]
        );
      } else {
        Alert.alert(t.verificationFailed, result.error || t.invalidOtpMsg);
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert(t.networkError, t.networkErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const result = await authService.resendOTP(phoneNumber);
      
      if (result.success) {
        Alert.alert(
          t.otpResent,
          `${t.otpResentMsg} ${formatPhoneDisplay(phoneNumber)}`
        );
        // Reset timer
        setResendTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert(t.failedToResend, result.error || 'Please try again');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
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
            <Text style={styles.phoneText}>
              +91 {formatPhoneDisplay(phoneNumber)}
            </Text>
          </View>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
            <Text style={styles.otpLabel}>{t.otpLabel}</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
            onPress={() => handleVerifyOTP()}
            disabled={loading || otp.some(digit => !digit)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>{t.verify}</Text>
            )}
          </TouchableOpacity>

          {/* Resend Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendText}>{t.resendText}</Text>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={!canResend || loading}
            >
              <Text style={[
                styles.resendButton,
                (!canResend || loading) && styles.resendButtonDisabled
              ]}>
                {canResend ? t.resend : `${t.resendIn} ${resendTimer}s`}
              </Text>
            </TouchableOpacity>
          </View>

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
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  otpSection: {
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#ccc',
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