import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  Alert, 
  RefreshControl 
} from 'react-native';
import { JobCard } from '../components/jobs/JobCard';
import { Job, JobStatus } from '@kaabil/shared';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface JobDiscoveryScreenProps {
  userLanguage?: Language;
}

export const JobDiscoveryScreen: React.FC<JobDiscoveryScreenProps> = ({ 
  userLanguage = Language.ENGLISH
}) => {
  const { t } = useTranslation(userLanguage);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Localized job data based on language
  const getLocalizedJobs = (): Job[] => {
    const baseJobs = [
      {
        id: 'job-001',
        wage: 500,
        distance: 2.5,
        employerId: 'emp-001',
        status: JobStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'job-002',
        wage: 350,
        distance: 1.8,
        employerId: 'emp-002',
        status: JobStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'job-003',
        wage: 450,
        distance: 3.2,
        employerId: 'emp-003',
        status: JobStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
    ];

    const localizedContent = {
      [Language.ENGLISH]: {
        jobs: [
          {
            title: 'Construction Worker',
            location: 'Sector 15, Gurgaon',
            requirements: ['Basic tools', 'Experience in construction'],
            description: 'Construction work for residential building project'
          },
          {
            title: 'Delivery Boy',
            location: 'Cyber City, Gurgaon',
            requirements: ['Own vehicle', 'Mobile phone'],
            description: 'Food delivery for nearby restaurants'
          },
          {
            title: 'Security Guard',
            location: 'Golf Course Road, Gurgaon',
            requirements: ['Security training', 'Night shift available'],
            description: 'Security services for office complex'
          }
        ]
      },
      [Language.HINDI]: {
        jobs: [
          {
            title: 'निर्माण मजदूर / Construction Worker',
            location: 'सेक्टर 15, गुड़गांव / Sector 15, Gurgaon',
            requirements: ['बुनियादी उपकरण', 'निर्माण में अनुभव'],
            description: 'आवासीय भवन परियोजना के लिए निर्माण कार्य'
          },
          {
            title: 'डिलीवरी बॉय / Delivery Boy',
            location: 'साइबर सिटी, गुड़गांव / Cyber City, Gurgaon',
            requirements: ['अपना वाहन', 'मोबाइल फोन'],
            description: 'नजदीकी रेस्तरां के लिए खाना डिलीवरी'
          },
          {
            title: 'सुरक्षा गार्ड / Security Guard',
            location: 'गोल्फ कोर्स रोड, गुड़गांव / Golf Course Road, Gurgaon',
            requirements: ['सुरक्षा प्रशिक्षण', 'रात की शिफ्ट उपलब्ध'],
            description: 'ऑफिस कॉम्प्लेक्स के लिए सुरक्षा सेवाएं'
          }
        ]
      },
      [Language.BENGALI]: {
        jobs: [
          {
            title: 'নির্মাণ শ্রমিক / Construction Worker',
            location: 'সেক্টর ১৫, গুড়গাঁও / Sector 15, Gurgaon',
            requirements: ['মৌলিক সরঞ্জাম', 'নির্মাণে অভিজ্ঞতা'],
            description: 'আবাসিক ভবন প্রকল্পের জন্য নির্মাণ কাজ'
          },
          {
            title: 'ডেলিভারি বয় / Delivery Boy',
            location: 'সাইবার সিটি, গুড়গাঁও / Cyber City, Gurgaon',
            requirements: ['নিজস্ব গাড়ি', 'মোবাইল ফোন'],
            description: 'কাছাকাছি রেস্তোরাঁর জন্য খাবার ডেলিভারি'
          },
          {
            title: 'নিরাপত্তা প্রহরী / Security Guard',
            location: 'গল্ফ কোর্স রোড, গুড়গাঁও / Golf Course Road, Gurgaon',
            requirements: ['নিরাপত্তা প্রশিক্ষণ', 'রাতের শিফট উপলব্ধ'],
            description: 'অফিস কমপ্লেক্সের জন্য নিরাপত্তা সেবা'
          }
        ]
      }
    };

    const contentForLanguage = localizedContent[userLanguage] || localizedContent[Language.ENGLISH];
    
    return baseJobs.map((baseJob, index) => ({
      ...baseJob,
      ...contentForLanguage.jobs[index]
    }));
  };

  useEffect(() => {
    loadJobs();
  }, [userLanguage]); // Reload jobs when language changes

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setJobs(getLocalizedJobs());
    } catch (error) {
      const errorMessages = {
        [Language.ENGLISH]: { title: 'Error', message: 'Failed to load jobs' },
        [Language.HINDI]: { title: 'त्रुटि', message: 'नौकरियां लोड करने में विफल' },
        [Language.BENGALI]: { title: 'ত্রুটি', message: 'চাকরি লোড করতে ব্যর্থ' }
      };
      const errorMsg = errorMessages[userLanguage] || errorMessages[Language.ENGLISH];
      Alert.alert(errorMsg.title, errorMsg.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleApply = (jobId: string) => {
    const alertMessages = {
      [Language.ENGLISH]: {
        title: 'Apply for Job',
        message: 'Are you sure you want to apply for this job?',
        cancel: 'Cancel',
        apply: 'Apply',
        success: 'Success',
        successMessage: 'Application submitted successfully!'
      },
      [Language.HINDI]: {
        title: 'नौकरी के लिए आवेदन करें',
        message: 'क्या आप वाकई इस नौकरी के लिए आवेदन करना चाहते हैं?',
        cancel: 'रद्द करें',
        apply: 'आवेदन करें',
        success: 'सफलता',
        successMessage: 'आवेदन सफलतापूर्वक भेजा गया!'
      },
      [Language.BENGALI]: {
        title: 'চাকরির জন্য আবেদন করুন',
        message: 'আপনি কি সত্যিই এই চাকরির জন্য আবেদন করতে চান?',
        cancel: 'বাতিল',
        apply: 'আবেদন করুন',
        success: 'সফল',
        successMessage: 'আবেদন সফলভাবে জমা দেওয়া হয়েছে!'
      }
    };

    const messages = alertMessages[userLanguage] || alertMessages[Language.ENGLISH];

    Alert.alert(
      messages.title,
      messages.message,
      [
        { text: messages.cancel, style: 'cancel' },
        { 
          text: messages.apply, 
          onPress: () => {
            Alert.alert(messages.success, messages.successMessage);
          }
        }
      ]
    );
  };

  if (loading && jobs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.jobsNearYou}</Text>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={handleApply}
            language={userLanguage}
          />
        ))}
        {jobs.length === 0 && !loading && (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {userLanguage === Language.HINDI 
                ? 'कोई नौकरी उपलब्ध नहीं' 
                : userLanguage === Language.BENGALI 
                ? 'কোন চাকরি উপলব্ধ নেই' 
                : 'No jobs available'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});