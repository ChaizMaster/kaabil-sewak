import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AudioButton } from '../audio/AudioButton';
import { Job } from '@kaabil/shared';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  language?: Language;
  userId?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  language = Language.ENGLISH,
  userId 
}) => {
  const { t } = useTranslation(language);

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    }
  };

  // Create a complete job description for audio playback
  const getJobDescription = () => {
    // For TTS, we want clean language-specific text
    const getCleanText = (text: string) => {
      if (language === Language.ENGLISH) {
        // For English, extract English part if bilingual
        if (text.includes(' / ')) {
          return text.split(' / ')[1] || text.split(' / ')[0];
        }
        return text;
      } else {
        // For Hindi/Bengali, extract local language part
        if (text.includes(' / ')) {
          return text.split(' / ')[0];
        }
        return text;
      }
    };

    const cleanTitle = getCleanText(job.title);
    const cleanLocation = getCleanText(job.location);
    const requirements = job.requirements.join('. ');
    
    // Create language-appropriate description
    if (language === Language.HINDI) {
      return `नौकरी: ${cleanTitle}. स्थान: ${cleanLocation}. वेतन: ${job.wage} रुपये प्रति दिन. आवश्यकताएं: ${requirements}`;
    } else if (language === Language.BENGALI) {
      return `চাকরি: ${cleanTitle}. স্থান: ${cleanLocation}. বেতন: ${job.wage} টাকা প্রতিদিন. প্রয়োজনীয়তা: ${requirements}`;
    } else {
      return `Job: ${cleanTitle}. Location: ${cleanLocation}. Wage: ${job.wage} rupees per day. Requirements: ${requirements}`;
    }
  };

  // Track audio interactions with backend
  const handleAudioStart = async () => {
    try {
      console.log('Audio started for job:', job.id);
      
      // Call backend API to track audio start
      if (userId) {
        const response = await fetch('http://localhost:3000/api/analytics/audio-interaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            jobId: job.id,
            action: 'audio_start',
            language,
            timestamp: new Date().toISOString(),
            jobTitle: job.title,
            jobLocation: job.location
          }),
        });

        if (!response.ok) {
          console.warn('Failed to track audio start:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error tracking audio start:', error);
    }
  };

  const handleAudioEnd = async () => {
    try {
      console.log('Audio ended for job:', job.id);
      
      // Call backend API to track audio end
      if (userId) {
        const response = await fetch('http://localhost:3000/api/analytics/audio-interaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            jobId: job.id,
            action: 'audio_end',
            language,
            timestamp: new Date().toISOString(),
            jobTitle: job.title,
            jobLocation: job.location
          }),
        });

        if (!response.ok) {
          console.warn('Failed to track audio end:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error tracking audio end:', error);
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
        
        <AudioButton
          testID="audio-button"
          text={getJobDescription()}
          language={language}
          accessibilityLabel={`Listen to ${job.title} job description`}
          onAudioStart={handleAudioStart}
          onAudioEnd={handleAudioEnd}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
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