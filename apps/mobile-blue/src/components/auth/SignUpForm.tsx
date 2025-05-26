import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Language, SignUpData } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';
import { LanguageChangeModal } from '../common/LanguageChangeModal';

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
  email?: string;
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
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const signUpData: SignUpData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
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

  const handleLanguageChange = (newLanguage: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and language indicator */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
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
             language === Language.BENGALI ? '🇧🇩 বা' : '🇺🇸 EN'}
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.email}</Text>
          <TextInput
            testID="email-input"
            accessibilityLabel="Enter your email address (optional)"
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            placeholder="example@gmail.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -50, // Offset the centering to place header at top
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    minHeight: 44, // Accessibility: minimum touch target
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
}); 