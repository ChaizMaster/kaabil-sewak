import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  BackHandler, 
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { JobCard } from '../components/jobs/JobCard';
import { Job, JobStatus } from '@kaabil/shared';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';

interface JobDiscoveryScreenProps {
  userLanguage?: Language;
  userName?: string;
  onNavigateToJobDetails?: (jobId: string) => void;
  onNavigateToProfile?: () => void;
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
  userLanguage = Language.ENGLISH,
  userName = 'User',
  onNavigateToJobDetails,
  onNavigateToProfile,
}) => {
  const { t } = useTranslation(userLanguage);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const getLocalizedJobs = (): Job[] => {
    const jobsData: LocalizedJobData[] = [
      {
        titleKey: 'constructionWorker',
        locationEn: 'Sector 15, Gurgaon',
        locationHi: 'सेक्टर 15, गुड़गांव',
        locationBn: 'সেক্টর ১৫, গুড়গাঁও',
        requirementsEn: ['Basic tools', 'Experience in construction', 'Safety gear required'],
        requirementsHi: ['बुनियादी उपकरण', 'निर्माण में अनुभव', 'सुरक्षा उपकरण आवश्यक'],
        requirementsBn: ['মৌলিক সরঞ্জাম', 'নির্মাণে অভিজ্ঞতা', 'নিরাপত্তা সরঞ্জাম প্রয়োজন'],
        descriptionKey: 'constructionWorkerDesc'
      },
      {
        titleKey: 'deliveryHelper',
        locationEn: 'Cyber City, Gurgaon',
        locationHi: 'साइबर सिटी, गुड़गांव',
        locationBn: 'সাইবার সিটি, গুড়গাঁও',
        requirementsEn: ['Own vehicle (bike/scooter)', 'Valid driving license', 'Smartphone with internet'],
        requirementsHi: ['अपना वाहन (बाइक/स्कूटर)', 'वैध ड्राइविंग लाइसेंस', 'इंटरनेट वाला स्मार्टफोन'],
        requirementsBn: ['নিজস্ব গাড়ি (বাইক/স্কুটার)', 'বৈধ ড্রাইভিং লাইসেন্স', 'ইন্টারনেট সহ স্মার্টফোন'],
        descriptionKey: 'deliveryHelperDesc'
      },
      {
        titleKey: 'securityGuard',
        locationEn: 'Golf Course Road, Gurgaon',
        locationHi: 'गोल्फ कोर्स रोड, गुड़गांव',
        locationBn: 'গল্ফ কোর্স রোড, গুড়গাঁও',
        requirementsEn: ['Security training certificate', 'Night shift availability', 'Min. 1 year experience'],
        requirementsHi: ['सुरक्षा प्रशिक्षण प्रमाण पत्र', 'रात की पाली की उपलब्धता', 'न्यूनतम 1 वर्ष का अनुभव'],
        requirementsBn: ['নিরাপত্তা প্রশিক্ষণ শংসাপত্র', 'রাতের শিফটের উপলব্ধতা', 'ন্যূনতম ১ বছরের অভিজ্ঞতা'],
        descriptionKey: 'securityGuardDesc'
      },
      {
        titleKey: 'housekeepingStaff',
        locationEn: 'Sohna Road, Gurgaon',
        locationHi: 'सोहना रोड, गुड़गांव',
        locationBn: 'সোহনা রোড, গুড়গাঁও',
        requirementsEn: ['Experience in cleaning', 'Knows how to use cleaning equipment'],
        requirementsHi: ['सफाई में अनुभव', 'सफाई उपकरण का उपयोग करना जानता हो'],
        requirementsBn: ['পরিষ্কার করার অভিজ্ঞতা', 'পরিষ্কারের সরঞ্জাম ব্যবহার করতে জানে'],
        descriptionKey: 'housekeepingStaffDesc'
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
      },
      {
        id: 'job-004',
        wage: 400,
        distance: 4.1,
        employerId: 'emp-004',
        status: JobStatus.ACTIVE,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      }
    ];
    
    return baseJobs.map((baseJob, index) => {
      const jobData = jobsData[index % jobsData.length]!;
      
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
      
      const title: string = t[jobData.titleKey] ?? 'Job Title Missing';
      const description = t[jobData.descriptionKey] ?? 'Description Missing';

      return {
        ...baseJob,
        title,
        location,
        requirements,
        description
      };
    });
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setJobs(getLocalizedJobs());
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert(t.errorFetchingJobs || 'Error', t.errorFetchingJobsMessage || 'Could not load jobs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userLanguage, t]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [t]);

  const handleBackPress = () => {
    Alert.alert(
      t.exitApp || 'Exit App',
      t.exitAppMessage || 'Are you sure you want to exit?',
      [
        {
          text: t.noStay || 'Stay',
          style: 'cancel',
          onPress: () => {} 
        },
        {
          text: t.yesExit || 'Exit',
          style: 'destructive',
          onPress: () => BackHandler.exitApp()
        }
      ],
      { cancelable: false }
    );
    return true; 
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadJobs();
  }, [loadJobs]);

  const handleApplyJob = useCallback((jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    Alert.alert(
      `${t.applyFor || 'Apply for'} ${job?.title || 'this job'}?`,
      t.confirmApplication || 'Proceed with your application?',
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        { 
          text: t.apply || 'Apply', 
          onPress: () => {
            Alert.alert(t.applicationSent || 'Application Sent', t.applicationSentMessage || 'Your application has been submitted.');
          }
        }
      ]
    );
  }, [jobs, t]);

  const handleViewJobDetails = useCallback((jobId: string) => {
    if (onNavigateToJobDetails) {
      onNavigateToJobDetails(jobId);
    } else {
      console.log('Navigate to job details for:', jobId);
      handleApplyJob(jobId);
    }
  }, [onNavigateToJobDetails, handleApplyJob]);

  const renderJobItem = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onApply={handleApplyJob}
      onPress={handleViewJobDetails}
      language={userLanguage}
    />
  );

  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
        <View style={styles.titleContainer}>
            <Text style={styles.greetingText}>{`${t.hello || 'Hello'} ${userName}!`}</Text>
            <Text style={styles.headerTitle}>{t.jobsNearYou || 'Jobs For You'}</Text>
        </View>
    </View>
  );

  if (loading && jobs.length === 0) {
    return (
      <SafeAreaView style={styles.safeAreaLoading}>
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#F055A8" />
          <Text style={styles.loadingText}>{t.loadingJobs || 'Finding Jobs...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.centeredMessageContainer}>
              <MaterialIcons name="sentiment-dissatisfied" size={60} color="#A0AEC0" style={styles.emptyIcon} />
              <Text style={styles.emptyStateText}>{t.noJobsFound || 'No jobs available right now.'}</Text>
              <Text style={styles.emptyStateSubtitle}>{t.checkBackLater || 'Please check back later or adjust your filters.'}</Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#F055A8']}
            tintColor={'#F055A8'}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  safeAreaLoading: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listHeaderContainer: {
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  titleContainer: {
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: '#A0AEC0',
  },
  centeredMessageContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: '40%',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  emptyIcon: {
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});