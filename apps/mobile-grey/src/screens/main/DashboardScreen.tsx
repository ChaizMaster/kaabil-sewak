import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

const translations = {
  english: {
    title: 'Dashboard',
    welcome: 'Welcome, Employer!',
  },
  hindi: {
    title: 'डैशबोर्ड',
    welcome: 'आपका स्वागत है, नियोक्ता!',
  },
  bengali: {
    title: 'ড্যাশবোর্ড',
    welcome: 'স্বাগতম, নিয়োগকর্তা!',
  },
};

const DashboardScreen = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.welcomeText}>{t.welcome}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#A0AEC0',
  },
});

export default DashboardScreen; 