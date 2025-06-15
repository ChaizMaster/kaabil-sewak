import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import JobService from '../../services/jobService';
import { StackNavigationProp } from '@react-navigation/stack';
import { commonStyles, theme } from '../../styles/common';

type MainTabParamList = {
  MyJobs: undefined;
  // other routes...
};

type PostJobNavigationProp = StackNavigationProp<MainTabParamList, 'MyJobs'>;

const translations = {
  english: {
    title: 'Post a New Job',
    jobTitle: 'Job Title',
    jobTitlePlaceholder: 'e.g., Cook, Driver, Electrician',
    jobDescription: 'Job Description',
    jobDescriptionPlaceholder: 'Describe the responsibilities, requirements, etc.',
    salary: 'Salary per Day (₹)',
    salaryPlaceholder: 'e.g., 800',
    numberOfOpenings: 'Number of Openings',
    numberOfOpeningsPlaceholder: 'e.g., 5',
    skillsRequired: 'Skills Required (comma-separated)',
    skillsPlaceholder: 'e.g., Driving, English Speaking',
    postJobButton: 'Post Job Now',
    posting: 'Posting...',
    allFieldsRequired: 'All fields are required',
    jobPostedSuccess: 'Job Posted Successfully!',
    jobPostedError: 'Failed to post job. Please try again.',
  },
  hindi: {
    title: 'एक नई नौकरी पोस्ट करें',
    jobTitle: 'नौकरी का शीर्षक',
    jobTitlePlaceholder: 'जैसे, रसोइया, ड्राइवर, इलेक्ट्रीशियन',
    jobDescription: 'नौकरी का विवरण',
    jobDescriptionPlaceholder: 'जिम्मेदारियों, आवश्यकताओं आदि का वर्णन करें।',
    salary: 'प्रति दिन वेतन (₹)',
    salaryPlaceholder: 'जैसे, 800',
    numberOfOpenings: 'रिक्तियों की संख्या',
    numberOfOpeningsPlaceholder: 'जैसे, 5',
    skillsRequired: 'आवश्यक कौशल (अल्पविराम से अलग)',
    skillsPlaceholder: 'जैसे, ड्राइविंग, अंग्रेजी बोलना',
    postJobButton: 'अभी नौकरी पोस्ट करें',
    posting: 'पोस्ट किया जा रहा है...',
    allFieldsRequired: 'सभी फ़ील्ड आवश्यक हैं',
    jobPostedSuccess: 'नौकरी सफलतापूर्वक पोस्ट की गई!',
    jobPostedError: 'नौकरी पोस्ट करने में विफल। कृपया पुन: प्रयास करें।',
  },
  bengali: {
    title: 'একটি নতুন কাজ পোস্ট করুন',
    jobTitle: 'কাজের শিরোনাম',
    jobTitlePlaceholder: 'যেমন, রান্না, ড্রাইভার, ইলেকট্রিশিয়ান',
    jobDescription: 'কাজের বিবরণ',
    jobDescriptionPlaceholder: 'দায়িত্ব, প্রয়োজনীয়তা ইত্যাদি বর্ণনা করুন।',
    salary: 'প্রতি দিন বেতন (₹)',
    salaryPlaceholder: 'যেমন, 800',
    numberOfOpenings: 'খালি পদের সংখ্যা',
    numberOfOpeningsPlaceholder: 'যেমন, 5',
    skillsRequired: 'প্রয়োজনীয় দক্ষতা (কমা দ্বারা পৃথক)',
    skillsPlaceholder: 'যেমন, ড্রাইভিং, ইংরেজি বলা',
    postJobButton: 'এখনই কাজ পোস্ট করুন',
    posting: 'পোস্ট করা হচ্ছে...',
    allFieldsRequired: 'সমস্ত ক্ষেত্র প্রয়োজনীয়',
    jobPostedSuccess: 'কাজ সফলভাবে পোস্ট করা হয়েছে!',
    jobPostedError: 'কাজ পোস্ট করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
  },
};

const PostJobScreen = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigation = useNavigation<PostJobNavigationProp>();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    openings: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    for (const key in formData) {
      if (!formData[key as keyof typeof formData].trim()) {
        Alert.alert('Validation Error', t.allFieldsRequired);
        return false;
      }
    }
    return true;
  };

  const handlePostJob = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await JobService.addJob({
        ...formData,
        skills: formData.skills.split(','),
      });

      setLoading(false);
      Alert.alert(t.jobPostedSuccess);
      
      setFormData({
        title: '',
        description: '',
        salary: '',
        openings: '',
        skills: '',
      });

      navigation.navigate('MyJobs');

    } catch (error) {
      setLoading(false);
      Alert.alert(t.jobPostedError);
      console.error('Failed to post job:', error);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={commonStyles.title}>{t.title}</Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.jobTitle}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder={t.jobTitlePlaceholder}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.jobDescription}</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder={t.jobDescriptionPlaceholder}
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.salary}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.salary}
                onChangeText={(value) => handleInputChange('salary', value)}
                placeholder={t.salaryPlaceholder}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.numberOfOpenings}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.openings}
                onChangeText={(value) => handleInputChange('openings', value)}
                placeholder={t.numberOfOpeningsPlaceholder}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.skillsRequired}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.skills}
                onChangeText={(value) => handleInputChange('skills', value)}
                placeholder={t.skillsPlaceholder}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.postButton, loading && styles.postButtonDisabled]}
            onPress={handlePostJob}
            disabled={loading}
            activeOpacity={0.75}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.white} size="small" />
            ) : (
              <Text style={styles.postButtonText}>{t.postJobButton}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    ...theme.typography.label,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#1E40AF',
  },
  postButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostJobScreen; 