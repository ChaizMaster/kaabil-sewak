import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VoiceCommandButton } from '../voice/VoiceCommandButton';
import { Job } from '@kaabil/shared';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const [isListening, setIsListening] = useState(false);

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    }
  };

  const handleVoicePress = () => {
    setIsListening(true);
  };

  const handleVoiceCommand = (command: string) => {
    if (command.toLowerCase().includes('apply')) {
      handleApply();
    }
    setIsListening(false);
  };

  return (
    <View style={styles.container} testID="job-card">
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.wage}>₹{job.wage}/day</Text>
      <Text style={styles.location}>
        {job.location} ({job.distance} km)
      </Text>
      
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
          accessibilityLabel={`Apply for ${job.title}`}
          accessibilityRole="button"
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
        
        <VoiceCommandButton
          testID="voice-command-button"
          isListening={isListening}
          onPress={handleVoicePress}
          onVoiceCommand={handleVoiceCommand}
          accessibilityLabel="Voice apply for job"
        />
      </View>
      
      {isListening && (
        <Text style={styles.voicePrompt}>
          Say "Apply" to apply for this job
        </Text>
      )}
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
  voicePrompt: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 