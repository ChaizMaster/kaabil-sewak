import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
  onContinue?: () => void;
  selectedLanguage?: Language;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelect,
  onContinue,
  selectedLanguage,
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(selectedLanguage || Language.ENGLISH);
  const { t } = useTranslation(currentLang);

  const handleLanguagePress = (language: Language) => {
    setCurrentLang(language);
    onLanguageSelect(language);
  };

  const languageOptions = [
    { code: Language.ENGLISH, name: 'English', testId: 'language-english' },
    { code: Language.HINDI, name: 'हिंदी', testId: 'language-hindi' },
    { code: Language.BENGALI, name: 'বাংলা', testId: 'language-bengali' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.selectLanguage}</Text>
      
      <View style={styles.languageList}>
        {languageOptions.map((option) => (
          <TouchableOpacity
            key={option.code}
            testID={option.testId}
            accessibilityLabel={`Select ${option.name} language`}
            style={[
              styles.languageOption,
              selectedLanguage === option.code && styles.selectedOption
            ]}
            onPress={() => handleLanguagePress(option.code)}
          >
            <Text style={styles.languageName}>{option.name}</Text>
            {selectedLanguage === option.code && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        testID="continue-button"
        style={[
          styles.continueButton,
          !selectedLanguage && styles.disabledButton
        ]}
        onPress={onContinue}
        disabled={!selectedLanguage}
      >
        <Text style={[
          styles.continueText,
          !selectedLanguage && styles.disabledText
        ]}>
          {t.continue}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#2E86AB',
  },
  languageList: {
    marginBottom: 40,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 44, // Accessibility: minimum touch target
  },
  selectedOption: {
    backgroundColor: '#E8F4FD',
    borderColor: '#2E86AB',
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  checkmark: {
    fontSize: 20,
    color: '#2E86AB',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#2E86AB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 44, // Accessibility: minimum touch target
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: '#888',
  },
}); 