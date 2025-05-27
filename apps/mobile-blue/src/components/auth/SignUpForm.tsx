import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { Language, SignUpData } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';
import { LanguageChangeModal } from '../common/LanguageChangeModal';
import { PhotoUpload } from '../common/PhotoUpload';

interface SignUpFormProps {
  onSignUp: (data: SignUpData) => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
  onLanguageChange?: (language: Language) => void;
  language: Language;
  isLoading?: boolean;
  error?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  photo?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSignUp,
  onSwitchToLogin,
  onBack,
  onLanguageChange,
  language,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation(language);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    photo: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  // Debug logging
  console.log('SignUpForm rendered with onBack:', !!onBack);

  const handleBackPress = () => {
    console.log('Back button pressed in SignUpForm');
    if (onBack) {
      console.log('Calling onBack function');
      onBack();
    } else {
      console.log('onBack function not provided');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.photo.trim()) {
      newErrors.photo = t.photoRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const signUpData: SignUpData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: undefined,
        photo: formData.photo,
        preferredLanguage: language,
      };
      onSignUp(signUpData);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoSelected = (photoUri: string) => {
    updateField('photo', photoUri);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and language indicator */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityLabel="Go back to language selection"
          >
            <Text style={styles.backButtonText}>← {t.back}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.languageIndicator}
          onPress={() => setIsLanguageModalVisible(true)}
          accessibilityLabel="Change language"
          testID="language-change-button"
        >
          <Text style={styles.languageText}>
            {language === Language.ENGLISH ? '🇺🇸 EN' :
             language === Language.HINDI ? '🇮🇳 हि' :
             language === Language.BENGALI ? '🇮🇳 বা' : '🇺🇸 EN'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Language Change Modal */}
      <LanguageChangeModal
        visible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
        selectedLanguage={language}
        onLanguageChange={handleLanguageChange}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t.signUp}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.name}</Text>
            <TextInput
              testID="name-input"
              accessibilityLabel="Enter your full name"
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder={t.name}
              placeholderTextColor="#999"
              autoCapitalize="words"
              autoComplete="name"
            />
            {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.phone}</Text>
            <TextInput
              testID="phone-input"
              accessibilityLabel="Enter your phone number"
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => updateField('phone', text)}
              placeholder="9876543210"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              autoComplete="tel"
              maxLength={10}
            />
            {errors.phone && <Text style={styles.fieldError}>{errors.phone}</Text>}
          </View>

          <PhotoUpload
            onPhotoSelected={handlePhotoSelected}
            language={language}
            selectedPhoto={formData.photo}
            error={errors.photo}
          />

          <TouchableOpacity
            testID="signup-button"
            style={[styles.signUpButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? t.loading : t.createAccount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="login-link"
            style={styles.loginLink}
            onPress={onSwitchToLogin}
          >
            <Text style={styles.loginLinkText}>{t.alreadyHaveAccount}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    minHeight: 44, // Accessibility: minimum touch target
    backgroundColor: '#E8F4FD', // Light blue background for visibility
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E86AB',
  },
  backButtonText: {
    color: '#2E86AB',
    fontSize: 16,
    fontWeight: '600',
  },
  languageIndicator: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  languageText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2E86AB',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    minHeight: 44, // Accessibility: minimum touch target
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  fieldError: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },
  signUpButton: {
    backgroundColor: '#2E86AB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    minHeight: 44, // Accessibility: minimum touch target
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  loginLinkText: {
    color: '#2E86AB',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40, // Extra bottom padding for comfortable scrolling
  },
}); 