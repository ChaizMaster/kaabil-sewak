import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface VoiceCommandButtonProps {
  testID?: string;
  isListening?: boolean;
  onPress?: () => void;
  onVoiceCommand?: (command: string) => void;
  accessibilityLabel?: string;
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  testID,
  isListening = false,
  onPress,
  onVoiceCommand,
  accessibilityLabel
}) => {
  const [currentlyListening, setCurrentlyListening] = useState(isListening);

  const handlePress = async () => {
    if (onPress) {
      onPress();
    }
    
    setCurrentlyListening(true);
    
    // Simulate voice recognition
    // In real implementation, this would use expo-speech or similar
    setTimeout(() => {
      if (onVoiceCommand) {
        onVoiceCommand('apply'); // Simulated voice command
      }
      setCurrentlyListening(false);
    }, 1000);
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.container,
        currentlyListening && styles.listening
      ]}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Text style={[
        styles.micIcon,
        { color: currentlyListening ? "#4CAF50" : "#666666" }
      ]}>
        🎤
      </Text>
      {currentlyListening && (
        <Text style={styles.listeningText}>Listening...</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    minWidth: 60,
  },
  listening: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  micIcon: {
    fontSize: 24,
  },
  listeningText: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 4,
  },
}); 