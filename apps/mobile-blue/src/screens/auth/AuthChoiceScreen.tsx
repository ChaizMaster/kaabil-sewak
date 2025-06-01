import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AuthChoiceScreenProps {
  onSignup: () => void;
  onLogin: () => void;
  onGoBack: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    mainTitle: 'Kaabil Sewak',
    welcomeSubtitle: 'Your Gateway to Meaningful Work',
    newUser: 'I\'m New Here',
    newUserDesc: 'Create an account to get started',
    existingUser: 'I Have an Account',
    existingUserDesc: 'Sign in to continue',
    back: 'Change Language',
  },
  hindi: {
    mainTitle: 'काबिल सेवक',
    welcomeSubtitle: 'सार्थक काम का आपका प्रवेश द्वार',
    newUser: 'मैं यहाँ नया हूँ',
    newUserDesc: 'शुरू करने के लिए एक खाता बनाएं',
    existingUser: 'मेरा खाता है',
    existingUserDesc: 'जारी रखने के लिए साइन इन करें',
    back: 'भाषा बदलें',
  },
  bengali: {
    mainTitle: 'কাবিল সেবক',
    welcomeSubtitle: 'অর্থপূর্ণ কাজের আপনার প্রবেশদ্বার',
    newUser: 'আমি এখানে নতুন',
    newUserDesc: 'শুরু করতে একটি অ্যাকাউন্ট তৈরি করুন',
    existingUser: 'আমার অ্যাকাউন্ট আছে',
    existingUserDesc: 'চালিয়ে যেতে সাইন ইন করুন',
    back: 'ভাষা পরিবর্তন করুন',
  },
};

export const AuthChoiceScreen: React.FC<AuthChoiceScreenProps> = ({
  onSignup,
  onLogin,
  onGoBack,
  language,
}) => {
  const t = translations[language];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.mainTitle}>{t.mainTitle}</Text>
          <Text style={styles.welcomeSubtitle}>{t.welcomeSubtitle}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.authOptionButton, styles.newUserButton]}
            onPress={onSignup}
            activeOpacity={0.75}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="person-add" size={28} color="#F0F4F8" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>{t.newUser}</Text>
              <Text style={styles.optionDesc}>{t.newUserDesc}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authOptionButton, styles.existingUserButton]}
            onPress={onLogin}
            activeOpacity={0.75}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="login" size={28} color="#F0F4F8" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>{t.existingUser}</Text>
              <Text style={styles.optionDesc}>{t.existingUserDesc}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={16} color="#A0AEC0" style={styles.backIcon}/>
            <Text style={styles.backButtonText}>{t.back}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  authOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 22,
    marginBottom: 24,
    borderWidth: 1,
    minHeight: 90,
  },
  newUserButton: {
    backgroundColor: 'rgba(48, 79, 254, 0.7)',
    borderColor: 'rgba(240, 244, 248, 0.3)',
  },
  existingUserButton: {
    backgroundColor: 'rgba(23, 42, 70, 0.65)',
    borderColor: 'rgba(240, 244, 248, 0.25)',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#D0D6E0',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
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
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '500',
  },
}); 