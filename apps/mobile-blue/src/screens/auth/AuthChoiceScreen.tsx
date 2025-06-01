import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface AuthChoiceScreenProps {
  onSignup: () => void;
  onLogin: () => void;
  onGoBack: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    title: 'Welcome to Kaabil Sewak',
    subtitle: 'Your path to better opportunities',
    newUser: 'I\'m New Here',
    newUserDesc: 'Create a new account',
    existingUser: 'I Have an Account',
    existingUserDesc: 'Sign in to your account',
    tagline: 'India\'s Most Intelligent Blue-Collar Hiring Platform',
    back: '← Change Language',
  },
  hindi: {
    title: 'काबिल सेवक में आपका स्वागत है',
    subtitle: 'बेहतर अवसरों का आपका रास्ता',
    newUser: 'मैं यहाँ नया हूँ',
    newUserDesc: 'नया खाता बनाएं',
    existingUser: 'मेरा खाता है',
    existingUserDesc: 'अपने खाते में लॉग इन करें',
    tagline: 'भारत का सबसे बुद्धिमान मजदूर भर्ती मंच',
    back: '← भाषा बदलें',
  },
  bengali: {
    title: 'কাবিল সেবকে আপনাকে স্বাগতম',
    subtitle: 'ভাল সুযোগের আপনার পথ',
    newUser: 'আমি এখানে নতুন',
    newUserDesc: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    existingUser: 'আমার অ্যাকাউন্ট আছে',
    existingUserDesc: 'আপনার অ্যাকাউন্টে সাইন ইন করুন',
    tagline: 'ভারতের সবচেয়ে বুদ্ধিমান নীল-কলার নিয়োগ প্ল্যাটফর্ম',
    back: '← ভাষা পরিবর্তন করুন',
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Kaabil Sewak</Text>
          <Text style={styles.taglineHindi}>काबिल सेवक</Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        {/* Auth Options */}
        <View style={styles.optionsContainer}>
          {/* New User Option */}
          <TouchableOpacity
            style={styles.authOption}
            onPress={onSignup}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>👤</Text>
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{t.newUser}</Text>
                <Text style={styles.optionDesc}>{t.newUserDesc}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Existing User Option */}
          <TouchableOpacity
            style={[styles.authOption, styles.loginOption]}
            onPress={onLogin}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, styles.loginIconContainer]}>
                <Text style={styles.icon}>🔑</Text>
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, styles.loginTitle]}>{t.existingUser}</Text>
                <Text style={[styles.optionDesc, styles.loginDesc]}>{t.existingUserDesc}</Text>
              </View>
              <Text style={[styles.arrow, styles.loginArrow]}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.tagline}</Text>
          
          {/* Back Button */}
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
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
    backgroundColor: '#F5F5F7',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  taglineHindi: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  authOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  loginOption: {
    borderColor: '#4A4A4A',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  loginIconContainer: {
    backgroundColor: '#F0F0F0',
  },
  icon: {
    fontSize: 28,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  loginTitle: {
    color: '#222222',
  },
  optionDesc: {
    fontSize: 14,
    color: '#888888',
  },
  loginDesc: {
    color: '#888888',
  },
  arrow: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  loginArrow: {
    color: '#4A4A4A',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
}); 