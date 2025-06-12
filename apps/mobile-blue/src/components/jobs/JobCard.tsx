import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Job } from '@kaabil/shared';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onPress?: (jobId: string) => void;
  language?: Language;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onPress,
  language = Language.ENGLISH
}) => {
  const { t } = useTranslation(language);

  const handleApplyPress = () => {
    if (onApply) {
      onApply(job.id);
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(job.id);
    } else {
      handleApplyPress();
    }
  };

  return (
    <TouchableOpacity style={styles.glassCardContainer} onPress={handleCardPress} activeOpacity={0.85}>
      <View style={styles.headerSection}>
        <Text style={styles.titleText} numberOfLines={2}>{job.title}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialIcons name="attach-money" size={20} color="#F055A8" style={styles.detailIcon} />
        <Text style={styles.wageText}>₹{job.wage}{t.perDay}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialIcons name="location-on" size={20} color="#A0AEC0" style={styles.detailIcon} />
        <Text style={styles.locationText}>
          {job.location} ({job.distance?.toFixed(1)} km {t.away})
        </Text>
      </View>
      
      {job.requirements && job.requirements.length > 0 && (
        <View style={styles.requirementsSection}>
          <Text style={styles.requirementsTitle}>{t.requirements}:</Text>
          {job.requirements.slice(0, 2).map((req: string, index: number) => (
            <View key={index} style={styles.requirementItem}>
              <MaterialIcons name="check-circle-outline" size={16} color="#A0AEC0" style={styles.requirementIcon}/>
              <Text style={styles.requirementText} numberOfLines={1}>{req}</Text>
            </View>
          ))}
          {job.requirements.length > 2 && (
            <Text style={styles.moreRequirementsText}>+ {job.requirements.length - 2} more</Text>
          )}
        </View>
      )}
      
      {onApply && (
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApplyPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="send" size={20} color="#F0F4F8" style={styles.applyButtonIcon} />
          <Text style={styles.applyButtonText}>{t.apply}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  glassCardContainer: {
    backgroundColor: 'rgba(23, 42, 70, 0.65)',
    borderRadius: 18,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.2)', 
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerSection: {
    marginBottom: 12,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 8,
  },
  wageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F055A8',
  },
  locationText: {
    fontSize: 15,
    color: '#A0AEC0',
    flexShrink: 1,
  },
  requirementsSection: {
    marginTop: 8,
    marginBottom: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240, 244, 248, 0.1)',
  },
  requirementsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F0F4F8',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requirementIcon: {
    marginRight: 6,
  },
  requirementText: {
    fontSize: 14,
    color: '#A0AEC0',
    flexShrink: 1,
  },
  moreRequirementsText: {
    fontSize: 13,
    color: '#A0AEC0',
    fontStyle: 'italic',
    marginTop: 4,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(48, 79, 254, 0.7)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.25)',
  },
  applyButtonIcon: {
    marginRight: 8,
  },
  applyButtonText: {
    color: '#F0F4F8',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 