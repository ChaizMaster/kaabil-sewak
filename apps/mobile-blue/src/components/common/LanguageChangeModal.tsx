import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LanguageSelector } from '../onboarding/LanguageSelector';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface LanguageChangeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageChangeModal: React.FC<LanguageChangeModalProps> = ({
  visible,
  onClose,
  selectedLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation(selectedLanguage);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.selectLanguage}</Text>
          <TouchableOpacity
            testID="close-button"
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close language selection"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <LanguageSelector
          onLanguageSelect={handleLanguageSelect}
          selectedLanguage={selectedLanguage}
          compact={true}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  closeButton: {
    padding: 8,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
}); 