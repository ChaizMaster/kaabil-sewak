import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';

interface VerificationFormData {
  idNumber: string;
  workerName: string;
  bankAccountNumber: string;
  ifscCode: string;
  upiId: string;
  idType: 'aadhaar' | 'voter' | 'driving' | 'pan' | 'other';
}

interface VerificationFormProps {
  onSubmit: (data: VerificationFormData) => void;
  onBack: () => void;
  initialWorkerName?: string;
  isLoading?: boolean;
}

const translations = {
  english: {
    title: 'Worker Verification Details',
    subtitle: 'Enter worker identification and payment information',
    idType: 'ID Document Type',
    idNumber: 'ID Number',
    idNumberPlaceholder: 'Enter ID number from document',
    workerName: 'Worker Name',
    workerNamePlaceholder: 'Full name as per ID document',
    bankDetails: 'Bank Details (Optional)',
    bankAccountNumber: 'Bank Account Number',
    bankAccountPlaceholder: 'Enter account number',
    ifscCode: 'IFSC Code',
    ifscPlaceholder: 'Enter IFSC code',
    upiDetails: 'UPI Details (Optional)',
    upiId: 'UPI ID',
    upiPlaceholder: 'Enter UPI ID (e.g., name@paytm)',
    submitVerification: 'Submit Verification',
    back: 'Back',
    fieldRequired: 'This field is required',
    invalidIdNumber: 'Please enter a valid ID number',
    invalidUpiId: 'Please enter a valid UPI ID',
    aadhaar: 'Aadhaar Card',
    voter: 'Voter ID',
    driving: 'Driving License',
    pan: 'PAN Card',
    other: 'Other ID',
  },
  hindi: {
    title: 'कर्मचारी सत्यापन विवरण',
    subtitle: 'कर्मचारी की पहचान और भुगतान जानकारी दर्ज करें',
    idType: 'आईडी दस्तावेज़ का प्रकार',
    idNumber: 'आईडी नंबर',
    idNumberPlaceholder: 'दस्तावेज़ से आईडी नंबर दर्ज करें',
    workerName: 'कर्मचारी का नाम',
    workerNamePlaceholder: 'आईडी दस्तावेज़ के अनुसार पूरा नाम',
    bankDetails: 'बैंक विवरण (वैकल्पिक)',
    bankAccountNumber: 'बैंक खाता संख्या',
    bankAccountPlaceholder: 'खाता संख्या दर्ज करें',
    ifscCode: 'IFSC कोड',
    ifscPlaceholder: 'IFSC कोड दर्ज करें',
    upiDetails: 'UPI विवरण (वैकल्पिक)',
    upiId: 'UPI ID',
    upiPlaceholder: 'UPI ID दर्ज करें (उदा., name@paytm)',
    submitVerification: 'सत्यापन सबमिट करें',
    back: 'वापस',
    fieldRequired: 'यह फ़ील्ड आवश्यक है',
    invalidIdNumber: 'कृपया वैध आईडी नंबर दर्ज करें',
    invalidUpiId: 'कृपया वैध UPI ID दर्ज करें',
    aadhaar: 'आधार कार्ड',
    voter: 'मतदाता पहचान पत्र',
    driving: 'ड्राइविंग लाइसेंस',
    pan: 'पैन कार्ड',
    other: 'अन्य आईडी',
  },
  bengali: {
    title: 'কর্মী যাচাইকরণ বিবরণ',
    subtitle: 'কর্মীর পরিচয় এবং পেমেন্ট তথ্য প্রবেশ করুন',
    idType: 'আইডি নথির ধরন',
    idNumber: 'আইডি নম্বর',
    idNumberPlaceholder: 'নথি থেকে আইডি নম্বর প্রবেশ করুন',
    workerName: 'কর্মীর নাম',
    workerNamePlaceholder: 'আইডি নথি অনুযায়ী পূর্ণ নাম',
    bankDetails: 'ব্যাংক বিবরণ (ঐচ্ছিক)',
    bankAccountNumber: 'ব্যাংক অ্যাকাউন্ট নম্বর',
    bankAccountPlaceholder: 'অ্যাকাউন্ট নম্বর প্রবেশ করুন',
    ifscCode: 'IFSC কোড',
    ifscPlaceholder: 'IFSC কোড প্রবেশ করুন',
    upiDetails: 'UPI বিবরণ (ঐচ্ছিক)',
    upiId: 'UPI ID',
    upiPlaceholder: 'UPI ID প্রবেশ করুন (যেমন, name@paytm)',
    submitVerification: 'যাচাইকরণ জমা দিন',
    back: 'পিছনে',
    fieldRequired: 'এই ক্ষেত্রটি প্রয়োজনীয়',
    invalidIdNumber: 'অনুগ্রহ করে একটি বৈধ আইডি নম্বর প্রবেশ করুন',
    invalidUpiId: 'অনুগ্রহ করে একটি বৈধ UPI ID প্রবেশ করুন',
    aadhaar: 'আধার কার্ড',
    voter: 'ভোটার আইডি',
    driving: 'ড্রাইভিং লাইসেন্স',
    pan: 'PAN কার্ড',
    other: 'অন্যান্য আইডি',
  },
};

const idTypeOptions = [
  { value: 'aadhaar', key: 'aadhaar' },
  { value: 'voter', key: 'voter' },
  { value: 'driving', key: 'driving' },
  { value: 'pan', key: 'pan' },
  { value: 'other', key: 'other' },
];

export const VerificationForm: React.FC<VerificationFormProps> = ({
  onSubmit,
  onBack,
  initialWorkerName = '',
  isLoading = false,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState<VerificationFormData>({
    idNumber: '',
    workerName: initialWorkerName,
    bankAccountNumber: '',
    ifscCode: '',
    upiId: '',
    idType: 'aadhaar',
  });

  const [errors, setErrors] = useState<Partial<VerificationFormData>>({});

  const updateField = (field: keyof VerificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<VerificationFormData> = {};

    // Required fields
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = t.fieldRequired;
    } else if (formData.idNumber.length < 4) {
      newErrors.idNumber = t.invalidIdNumber;
    }

    if (!formData.workerName.trim()) {
      newErrors.workerName = t.fieldRequired;
    }

    // UPI validation if provided
    if (formData.upiId.trim() && !formData.upiId.includes('@')) {
      newErrors.upiId = t.invalidUpiId;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert('Validation Error', 'Please correct the highlighted fields');
    }
  };

  const renderIdTypePicker = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{t.idType}</Text>
      <View style={styles.idTypeContainer}>
        {idTypeOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.idTypeOption,
              formData.idType === option.value && styles.idTypeOptionSelected,
            ]}
            onPress={() => updateField('idType', option.value as any)}
          >
            <Text
              style={[
                styles.idTypeText,
                formData.idType === option.value && styles.idTypeTextSelected,
              ]}
            >
              {t[option.key as keyof typeof t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        <View style={styles.form}>
          {renderIdTypePicker()}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.idNumber}</Text>
            <TextInput
              style={[styles.textInput, errors.idNumber && styles.textInputError]}
              value={formData.idNumber}
              onChangeText={(text) => updateField('idNumber', text)}
              placeholder={t.idNumberPlaceholder}
              placeholderTextColor="rgba(160, 174, 192, 0.6)"
              autoCapitalize="characters"
            />
            {errors.idNumber && (
              <Text style={styles.errorText}>{errors.idNumber}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.workerName}</Text>
            <TextInput
              style={[styles.textInput, errors.workerName && styles.textInputError]}
              value={formData.workerName}
              onChangeText={(text) => updateField('workerName', text)}
              placeholder={t.workerNamePlaceholder}
              placeholderTextColor="rgba(160, 174, 192, 0.6)"
              autoCapitalize="words"
            />
            {errors.workerName && (
              <Text style={styles.errorText}>{errors.workerName}</Text>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <MaterialIcons name="account-balance" size={20} color="#A0AEC0" />
            <Text style={styles.sectionTitle}>{t.bankDetails}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.bankAccountNumber}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.bankAccountNumber}
              onChangeText={(text) => updateField('bankAccountNumber', text)}
              placeholder={t.bankAccountPlaceholder}
              placeholderTextColor="rgba(160, 174, 192, 0.6)"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.ifscCode}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.ifscCode}
              onChangeText={(text) => updateField('ifscCode', text.toUpperCase())}
              placeholder={t.ifscPlaceholder}
              placeholderTextColor="rgba(160, 174, 192, 0.6)"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.sectionHeader}>
            <MaterialIcons name="payment" size={20} color="#A0AEC0" />
            <Text style={styles.sectionTitle}>{t.upiDetails}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.upiId}</Text>
            <TextInput
              style={[styles.textInput, errors.upiId && styles.textInputError]}
              value={formData.upiId}
              onChangeText={(text) => updateField('upiId', text.toLowerCase())}
              placeholder={t.upiPlaceholder}
              placeholderTextColor="rgba(160, 174, 192, 0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.upiId && (
              <Text style={styles.errorText}>{errors.upiId}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={20} color="#2563EB" />
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <MaterialIcons name="check" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>{t.submitVerification}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0F4F8',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1A2942',
    color: '#F0F4F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textInputError: {
    borderColor: '#E53E3E',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginTop: 4,
  },
  idTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  idTypeOption: {
    backgroundColor: '#1A2942',
    borderWidth: 1,
    borderColor: '#2D3748',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
  },
  idTypeOptionSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  idTypeText: {
    color: '#A0AEC0',
    fontSize: 14,
    textAlign: 'center',
  },
  idTypeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A0AEC0',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0A192F',
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#1E40AF',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export type { VerificationFormData }; 