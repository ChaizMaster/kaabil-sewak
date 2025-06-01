import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';

interface LanguageSelectionScreenProps {
  onLanguageSelected: (language: 'english' | 'hindi' | 'bengali') => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onLanguageSelected,
}) => {
  const languages = [
    {
      code: 'english' as const,
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
    },
    {
      code: 'hindi' as const,
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
    },
    {
      code: 'bengali' as const,
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇮🇳',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Kaabil Sewak</Text>
          <Text style={styles.tagline}>काबिल सेवक</Text>
          <Text style={styles.subtitle}>Choose Your Language</Text>
          <Text style={styles.subtitleNative}>अपनी भाषा चुनें</Text>
        </View>

        {/* Language Options */}
        <View style={styles.languageContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={styles.languageOption}
              onPress={() => onLanguageSelected(language.code)}
              activeOpacity={0.7}
            >
              <View style={styles.languageContent}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.languageText}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNative}>{language.nativeName}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            India's Most Intelligent Blue-Collar Hiring Platform
          </Text>
          <Text style={styles.footerTextNative}>
            भारत का सबसे बुद्धिमान मजदूर भर्ती मंच
          </Text>
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
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleNative: {
    fontSize: 20,
    color: '#888888',
    textAlign: 'center',
  },
  languageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  languageOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 16,
    color: '#888888',
  },
  arrow: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerTextNative: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
  },
}); 