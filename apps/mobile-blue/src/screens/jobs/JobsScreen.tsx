import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface JobsScreenProps {
  userLanguage: 'english' | 'hindi' | 'bengali';
  userName?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  onProfilePress: () => void;
}

const translations = {
  english: {
    title: 'Jobs Near You',
    subtitle: 'Find the perfect job opportunity',
    noJobsYet: 'Setting up jobs for your area...',
    comingSoon: 'Job listings will be available soon!',
    locationInfo: 'Your location',
    profileIncomplete: 'Complete your profile to see more jobs',
    profile: 'Profile',
  },
  hindi: {
    title: 'आपके आस-पास की नौकरियां',
    subtitle: 'सही नौकरी का अवसर खोजें',
    noJobsYet: 'आपके क्षेत्र के लिए नौकरियां सेट की जा रही हैं...',
    comingSoon: 'नौकरी की सूची जल्द ही उपलब्ध होगी!',
    locationInfo: 'आपका स्थान',
    profileIncomplete: 'अधिक नौकरियां देखने के लिए अपनी प्रोफाइल पूरी करें',
    profile: 'प्रोफाइल',
  },
  bengali: {
    title: 'আপনার কাছাকাছি চাকরি',
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
  const t = translations[userLanguage];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Profile Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <Text style={styles.profileButtonText}>👤</Text>
            <Text style={styles.profileButtonLabel}>{t.profile}</Text>
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        {userLocation && (
          <View style={styles.locationCard}>
            <Text style={styles.locationTitle}>📍 {t.locationInfo}</Text>
            <Text style={styles.locationText}>
              {userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
            </Text>
          </View>
        )}

        {/* Sample Job Cards */}
        <View style={styles.jobsList}>
          <TouchableOpacity style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>🔨 Construction Worker</Text>
              <Text style={styles.jobSalary}>₹500/day</Text>
            </View>
            <Text style={styles.jobDescription}>Building construction site work. Experience preferred.</Text>
            <Text style={styles.jobLocation}>📍 2.5 km away</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>🏠 House Cleaning</Text>
              <Text style={styles.jobSalary}>₹300/day</Text>
            </View>
            <Text style={styles.jobDescription}>Regular house cleaning work. Flexible timing.</Text>
            <Text style={styles.jobLocation}>📍 1.2 km away</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>🚚 Delivery Helper</Text>
              <Text style={styles.jobSalary}>₹400/day</Text>
            </View>
            <Text style={styles.jobDescription}>Loading and unloading delivery trucks.</Text>
            <Text style={styles.jobLocation}>📍 3.8 km away</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>🔧 Maintenance Work</Text>
              <Text style={styles.jobSalary}>₹450/day</Text>
            </View>
            <Text style={styles.jobDescription}>General maintenance and repair work.</Text>
            <Text style={styles.jobLocation}>📍 1.8 km away</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>🍳 Kitchen Helper</Text>
              <Text style={styles.jobSalary}>₹350/day</Text>
            </View>
            <Text style={styles.jobDescription}>Restaurant kitchen assistance. Food preparation.</Text>
            <Text style={styles.jobLocation}>📍 3.2 km away</Text>
          </TouchableOpacity>
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