import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  Alert, 
  RefreshControl,
  BackHandler 
} from 'react-native';
import { JobCard } from '../components/jobs/JobCard';
import { Job, JobStatus } from '@kaabil/shared';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface JobDiscoveryScreenProps {
  userLanguage?: Language;
}

interface LocalizedJobData {
  titleKey: keyof import('shared/src/localization/translations').Translations;
  locationEn: string;
  locationHi: string;
  locationBn: string;
  requirementsEn: string[];
  requirementsHi: string[];
  requirementsBn: string[];
  descriptionKey: keyof import('shared/src/localization/translations').Translations;
}

export const JobDiscoveryScreen: React.FC<JobDiscoveryScreenProps> = ({ 
  userLanguage = Language.ENGLISH
}) => {
  const { t } = useTranslation(userLanguage);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Localized job data using translation keys
  const getLocalizedJobs = (): Job[] => {
    const jobsData: LocalizedJobData[] = [
      {
        titleKey: 'constructionWorker',
        locationEn: 'Sector 15, Gurgaon',
        locationHi: 'सेक्टर 15, गुड़गांव',
        locationBn: 'সেক্টর ১৫, গুড়গাঁও',
        requirementsEn: ['Basic tools', 'Experience in construction'],
        requirementsHi: ['बुनियादी उपकरण', 'निर्माण में अनुभव'],
        requirementsBn: ['মৌলিক সরঞ্জাম', 'নির্মাণে অভিজ্ঞতা'],
        descriptionKey: 'constructionWorkerDesc'
      },
      {
        titleKey: 'deliveryHelper',
        locationEn: 'Cyber City, Gurgaon',
        locationHi: 'साइबर सिटी, गुड़गांव',
        locationBn: 'সাইবার সিটি, গুড়গাঁও',
        requirementsEn: ['Own vehicle', 'Mobile phone'],
        requirementsHi: ['अपना वाहन', 'मोबाइल फोन'],
        requirementsBn: ['নিজস্ব গাড়ি', 'মোবাইল ফোন'],
        descriptionKey: 'deliveryHelperDesc'
      },
      {
        titleKey: 'securityGuard',
        locationEn: 'Golf Course Road, Gurgaon',
        locationHi: 'गोल्फ कोर्स रोड, गुड़गांव',
        locationBn: 'গল্ফ কোর্স রোড, গুড়গাঁও',
        requirementsEn: ['Security training', 'Night shift available'],
        requirementsHi: ['सुरक्षा प्रशिक्षण', 'रात की शिफ्ट उपलब्ध'],
        requirementsBn: ['নিরাপত্তা প্রশিক্ষণ', 'রাতের শিফট উপলব্ধ'],
        descriptionKey: 'securityGuardDesc'
      }
    ];

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
    
    return baseJobs.map((baseJob, index) => {
      const jobData = jobsData[index];
      
      let location: string;
      let requirements: string[];
      
      switch (userLanguage) {
        case Language.HINDI:
          location = jobData.locationHi;
          requirements = jobData.requirementsHi;
          break;
        case Language.BENGALI:
          location = jobData.locationBn;
          requirements = jobData.requirementsBn;
          break;
        default:
          location = jobData.locationEn;
          requirements = jobData.requirementsEn;
          break;
      }
      
      return {
        ...baseJob,
        title: t[jobData.titleKey],
        location,
        requirements,
        description: t[jobData.descriptionKey]
      };
    });
  };

  useEffect(() => {
    loadJobs();
  }, [userLanguage]); // Reload jobs when language changes

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => backHandler.remove();
  }, [userLanguage]);

  const handleBackPress = () => {
    Alert.alert(
      t.exitApp,
      t.exitAppMessage,
      [
        {
          text: t.noStay,
          style: 'cancel',
          onPress: () => {} // Stay in the app
        },
        {
          text: t.yesExit,
          style: 'destructive',
          onPress: () => BackHandler.exitApp()
        }
      ],
      { cancelable: false }
    );

    return true; // Prevent default back behavior
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setJobs(getLocalizedJobs());
    } catch (error) {
      Alert.alert(t.error, t.error);
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
    Alert.alert(
      t.apply,
      t.confirm,
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: t.apply, 
          onPress: () => {
            Alert.alert(t.success, t.success);
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
            <Text style={styles.emptyText}>{t.noJobsAvailable}</Text>
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