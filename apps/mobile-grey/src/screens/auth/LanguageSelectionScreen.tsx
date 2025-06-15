import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage, Language } from '../../context/LanguageContext';

type AuthStackParamList = {
  LanguageSelection: undefined;
  AuthChoice: undefined;
};

type LanguageSelectionNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'LanguageSelection'
>;

const LanguageSelectionScreen = () => {
  const navigation = useNavigation<LanguageSelectionNavigationProp>();
  const { setLanguage } = useLanguage();

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

  const handleLanguageSelected = (language: Language) => {
    setLanguage(language);
    navigation.navigate('AuthChoice');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>Kaabil Staff</Text>
          <Text style={styles.subtitle}>Choose Your Language</Text>
          <Text style={styles.subtitleNative}>अपनी भाषा चुनें</Text>
        </View>

        <View style={styles.languageListContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={styles.languageOptionButton}
              onPress={() => handleLanguageSelected(language.code)}
              activeOpacity={0.75}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.languageTextContainer}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNativeName}>
                    {language.nativeName}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={22}
                color="#A0AEC0"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            India's Most Intelligent Hiring Platform
          </Text>
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
    marginTop: 30,
    marginBottom: 40,
  },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleNative: {
    fontSize: 18,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  languageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(23, 42, 70, 0.65)',
    borderRadius: 18,
    marginBottom: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.25)',
    minHeight: 70,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 28,
    marginRight: 18,
  },
  languageTextContainer: {},
  languageName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 3,
  },
  languageNativeName: {
    fontSize: 15,
    color: '#A0AEC0',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240, 244, 248, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(160, 174, 192, 0.7)',
    textAlign: 'center',
  },
});

export default LanguageSelectionScreen;