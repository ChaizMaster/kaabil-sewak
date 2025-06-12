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
  },
};

const PostJobScreen = () => {
  const { language } = useLanguage();
  const t = translations[language];

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

  const handlePostJob = () => {
    if (!validateForm()) return;

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your job has been posted!');
      // In a real app, navigate to MyJobs or clear the form
      setFormData({
        title: '',
        description: '',
        salary: '',
        openings: '',
        skills: '',
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t.title}</Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.jobTitle}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder={t.jobTitlePlaceholder}
                placeholderTextColor="rgba(160, 174, 192, 0.6)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.jobDescription}</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder={t.jobDescriptionPlaceholder}
                placeholderTextColor="rgba(160, 174, 192, 0.6)"
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
                placeholderTextColor="rgba(160, 174, 192, 0.6)"
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
                placeholderTextColor="rgba(160, 174, 192, 0.6)"
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
                placeholderTextColor="rgba(160, 174, 192, 0.6)"
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
              <ActivityIndicator color="#F0F4F8" size="small" />
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
    backgroundColor: '#0A192F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0AEC0',
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#1E40AF',
  },
  postButtonText: {
    color: '#F0F4F8',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostJobScreen; 