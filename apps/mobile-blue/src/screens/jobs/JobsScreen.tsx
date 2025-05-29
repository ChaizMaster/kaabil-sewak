import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface JobsScreenProps {
  userLanguage: Language;
  userName?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  onProfilePress: () => void;
}

interface JobData {
  id: string;
  titleKey: keyof import('shared/src/localization/translations').Translations;
  descriptionKey: keyof import('shared/src/localization/translations').Translations;
  salary: number;
  distance: number;
}

// Sample job data with translation keys
const sampleJobs: JobData[] = [
  {
    id: '1',
    titleKey: 'constructionWorker',
    descriptionKey: 'constructionWorkerDesc',
    salary: 500,
    distance: 2.5,
  },
  {
    id: '2',
    titleKey: 'houseCleaning',
    descriptionKey: 'houseCleaningDesc',
    salary: 300,
    distance: 1.2,
  },
  {
    id: '3',
    titleKey: 'deliveryHelper',
    descriptionKey: 'deliveryHelperDesc',
    salary: 400,
    distance: 3.8,
  },
  {
    id: '4',
    titleKey: 'maintenanceWork',
    descriptionKey: 'maintenanceWorkDesc',
    salary: 450,
    distance: 1.8,
  },
  {
    id: '5',
    titleKey: 'kitchenHelper',
    descriptionKey: 'kitchenHelperDesc',
    salary: 350,
    distance: 3.2,
  },
];

// Legacy translations for JobsScreen specific text (to be deprecated)
const legacyTranslations = {
  [Language.ENGLISH]: {
    subtitle: 'Find the perfect job opportunity',
    noJobsYet: 'Setting up jobs for your area...',
    comingSoon: 'Job listings will be available soon!',
    locationInfo: 'Your location',
    profileIncomplete: 'Complete your profile to see more jobs',
    profile: 'Profile',
  },
  [Language.HINDI]: {
    subtitle: 'सही नौकरी का अवसर खोजें',
    noJobsYet: 'आपके क्षेत्र के लिए नौकरियां सेट की जा रही हैं...',
    comingSoon: 'नौकरी की सूची जल्द ही उपलब्ध होगी!',
    locationInfo: 'आपका स्थान',
    profileIncomplete: 'अधिक नौकरियां देखने के लिए अपनी प्रोफाइल पूरी करें',
    profile: 'प्रोफाइल',
  },
  [Language.BENGALI]: {
    subtitle: 'নিখুঁত চাকরির সুযোগ খুঁজুন',
    noJobsYet: 'আপনার এলাকার জন্য চাকরি সেট করা হচ্ছে...',
    comingSoon: 'চাকরির তালিকা শীঘ্রই উপলব্ধ হবে!',
    locationInfo: 'আপনার অবস্থান',
    profileIncomplete: 'আরও চাকরি দেখতে আপনার প্রোফাইল সম্পূর্ণ করুন',
    profile: 'প্রোফাইল',
  },
};

export const JobsScreen: React.FC<JobsScreenProps> = ({
  userLanguage,
  userName,
  userLocation,
  onProfilePress,
}) => {
  const { t } = useTranslation(userLanguage);
  const legacy = legacyTranslations[userLanguage];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Profile Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.jobsNearYou}</Text>
            <Text style={styles.subtitle}>{legacy.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <Text style={styles.profileButtonText}>👤</Text>
            <Text style={styles.profileButtonLabel}>{legacy.profile}</Text>
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        {userLocation && (
          <View style={styles.locationCard}>
            <Text style={styles.locationTitle}>📍 {legacy.locationInfo}</Text>
            <Text style={styles.locationText}>
              {userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
            </Text>
          </View>
        )}

        {/* Localized Job Cards */}
        <View style={styles.jobsList}>
          {sampleJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{t[job.titleKey]}</Text>
                <Text style={styles.jobSalary}>₹{job.salary}{t.perDay}</Text>
              </View>
              <Text style={styles.jobDescription}>{t[job.descriptionKey]}</Text>
              <Text style={styles.jobLocation}>📍 {job.distance} {t.kmAway}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 16,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  profileButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileButtonText: {
    fontSize: 20,
    marginBottom: 2,
    color: '#007AFF',
  },
  profileButtonLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#888888',
  },
  jobsList: {
    marginBottom: 24,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    flex: 1,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  jobDescription: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
    lineHeight: 20,
  },
  jobLocation: {
    fontSize: 12,
    color: '#AAAAAA',
  },
}); 