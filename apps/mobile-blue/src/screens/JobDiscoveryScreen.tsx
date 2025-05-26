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

  // Mock data for demonstration
  const mockJobs: Job[] = [
    {
      id: 'job-001',
      title: 'Construction Worker',
      wage: 500,
      location: 'Sector 15, Gurgaon',
      distance: 2.5,
      requirements: ['Basic tools', 'Experience in construction'],
      employerId: 'emp-001',
      status: JobStatus.ACTIVE,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      description: 'Construction work for residential building project'
    },
    {
      id: 'job-002',
      title: 'Delivery Boy',
      wage: 350,
      location: 'Cyber City, Gurgaon',
      distance: 1.8,
      requirements: ['Own vehicle', 'Mobile phone'],
      employerId: 'emp-002',
      status: JobStatus.ACTIVE,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      description: 'Food delivery for nearby restaurants'
    },
    {
      id: 'job-003',
      title: 'Security Guard',
      wage: 450,
      location: 'Golf Course Road, Gurgaon',
      distance: 3.2,
      requirements: ['Security training', 'Night shift available'],
      employerId: 'emp-003',
      status: JobStatus.ACTIVE,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      description: 'Security services for office complex'
    }
  ];

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setJobs(mockJobs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load jobs');
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
      'Apply for Job',
      'Are you sure you want to apply for this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply', 
          onPress: () => {
            Alert.alert('Success', 'Application submitted successfully!');
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
          />
        ))}
        {jobs.length === 0 && !loading && (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No jobs available</Text>
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