import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Job } from '@kaabil/shared';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  language?: Language;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  language = Language.ENGLISH
}) => {
  const { t } = useTranslation(language);

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    }
  };

  return (
    <View style={styles.container} testID="job-card">
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.wage}>₹{job.wage}{t.perDay}</Text>
      <Text style={styles.location}>
        {job.location} ({job.distance} km {t.away})
      </Text>
      
      <Text style={styles.requirementsTitle}>{t.requirements}:</Text>
      <View style={styles.requirements}>
        {job.requirements.map((req, index) => (
          <Text key={index} style={styles.requirement}>
            • {req}
          </Text>
        ))}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApply}
          accessibilityLabel={`${t.apply} for ${job.title}`}
          accessibilityRole="button"
        >
          <Text style={styles.applyText}>{t.apply}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  wage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  requirements: {
    marginBottom: 16,
  },
  requirement: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
  },
  applyText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
}); 