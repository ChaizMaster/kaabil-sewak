import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
import JobService, { Job } from '../../services/jobService';
import { MaterialIcons } from '@expo/vector-icons';
import { commonStyles, theme } from '../../styles/common';

const translations = {
  english: {
    title: 'My Job Postings',
    myJobs: 'My Jobs',
    verification: 'Verify Workers',
    musterRoll: 'Attendance',
    profile: 'Profile',
    noJobs: 'You have not posted any jobs yet.',
    postedOn: 'Posted on',
    openings: 'Openings',
    deleteJobTitle: 'Delete Job',
    deleteJobMessage: 'Are you sure you want to delete this job posting?',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  hindi: {
    title: 'मेरी नौकरी पोस्टिंग',
    myJobs: 'मेरी नौकरियां',
    verification: 'कर्मचारी सत्यापन',
    musterRoll: 'हाजिरी',
    profile: 'प्रोफ़ाइल',
    noJobs: 'आपने अभी तक कोई नौकरी पोस्ट नहीं की है।',
    postedOn: 'पर पोस्ट किया गया',
    openings: 'रिक्त पद',
    deleteJobTitle: 'नौकरी हटाएं',
    deleteJobMessage: 'क्या आप वाकई इस नौकरी पोस्टिंग को हटाना चाहते हैं?',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
  },
  bengali: {
    title: 'আমার চাকরির পোস্টিং',
    myJobs: 'আমার কাজ',
    verification: 'কর্মী যাচাই',
    musterRoll: 'উপস্থিতি',
    profile: 'প্রোফাইল',
    noJobs: 'আপনি এখনও কোনো কাজ পোস্ট করেননি।',
    postedOn: 'পোস্ট করা হয়েছে',
    openings: 'খালি পদ',
    deleteJobTitle: 'কাজ মুছুন',
    deleteJobMessage: 'আপনি কি নিশ্চিত যে আপনি এই চাকরির পোস্টিং মুছে ফেলতে চান?',
    cancel: 'বাতিল করুন',
    delete: 'মুছে ফেলুন',
  },
};

const JobCard = ({ job, language, onDelete }: { job: Job, language: 'english' | 'hindi' | 'bengali', onDelete: (jobId: string) => void }) => {
  const t = translations[language];
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <TouchableOpacity onPress={() => onDelete(job.id)} style={styles.deleteButton}>
          <MaterialIcons name="delete-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
      <Text style={styles.jobDescription}>{job.description}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.salary}>₹{job.salary} / day</Text>
        <Text style={styles.openings}>{job.openings} {t.openings}</Text>
      </View>
      <View style={styles.skillsContainer}>
        {job.skills.map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.postedDate}>{t.postedOn} {formatDate(job.postedDate)}</Text>
    </View>
  );
};

const MyJobsScreen = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedJobs = await JobService.getJobs();
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [fetchJobs])
  );

  const handleDeleteJob = (jobId: string) => {
    Alert.alert(
      t.deleteJobTitle,
      t.deleteJobMessage,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await JobService.deleteJob(jobId);
              // Optimistically update UI
              setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
            } catch (error) {
              console.error('Failed to delete job', error);
              Alert.alert('Error', 'Failed to delete job posting.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="work-outline" size={64} color={theme.colors.secondary} />
      <Text style={styles.emptyText}>{t.noJobs}</Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>{t.title}</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={jobs}
            renderItem={({ item }) => <JobCard job={item} language={language} onDelete={handleDeleteJob} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyComponent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  // Card styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1, // Ensure title takes available space
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  salary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.success, // Green color for salary
  },
  openings: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillBadge: {
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  postedDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
});

export default MyJobsScreen; 