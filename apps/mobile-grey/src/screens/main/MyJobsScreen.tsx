import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

const translations = {
  english: {
    title: 'My Job Postings',
  },
  hindi: {
    title: 'मेरी नौकरी पोस्टिंग',
  },
  bengali: {
    title: 'আমার চাকরির পোস্টিং',
  },
};

const MyJobsScreen = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t.title}</Text>
        {/* List of posted jobs will be built here */}
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default MyJobsScreen; 