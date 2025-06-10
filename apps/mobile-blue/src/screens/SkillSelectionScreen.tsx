import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../styles/theme';

interface SkillSelectionScreenProps {
  onSkillsSelected: (skills: string[]) => void;
}

const SKILLS = [
  'Construction Worker (Mistri)',
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Welder',
  'Mason (Rajmistri)',
  'Factory Worker',
  'Warehouse Staff / Packer',
  'Delivery Person',
  'Driver',
  'Security Guard',
  'Housekeeping / Cleaner (Safai Karmachari)',
  'Gardener (Mali)',
  'Cook / Chef',
  'Tailor (Darzi)',
  'General Helper / Labourer',
];

const SkillSelectionScreen: React.FC<SkillSelectionScreenProps> = ({
  onSkillsSelected,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const isSkillSelected = (skill: string) => {
    return selectedSkills.includes(skill);
  };

  const handleContinue = () => {
    if (selectedSkills.length > 0) {
      onSkillsSelected(selectedSkills);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Select Your Skills</Text>
        <Text style={styles.subtitle}>
          Choose one or more skills that you are good at.
        </Text>
        <View style={styles.skillContainer}>
          {SKILLS.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.skillButton,
                isSkillSelected(skill) && styles.selectedSkillButton,
              ]}
              onPress={() => toggleSkill(skill)}
            >
              <Text
                style={[
                  styles.skillText,
                  isSkillSelected(skill) && styles.selectedSkillText,
                ]}
              >
                {skill}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSkills.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedSkills.length === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // To make space for the footer
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  skillButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedSkillButton: {
    borderColor: theme.colors.otpFocus,
    backgroundColor: theme.colors.card,
  },
  skillText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedSkillText: {
    color: theme.colors.otpFocus,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240, 244, 248, 0.1)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(48, 79, 254, 0.8)',
    borderRadius: 18,
    paddingVertical: 18,
    minHeight: 60,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.35)',
  },
  disabledButton: {
    backgroundColor: '#5D636D',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SkillSelectionScreen; 