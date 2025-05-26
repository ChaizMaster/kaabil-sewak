import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface AudioButtonProps {
  testID?: string;
  text: string;
  language?: Language;
  accessibilityLabel?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  testID,
  text,
  language = Language.ENGLISH,
  accessibilityLabel
}) => {
  const { t } = useTranslation(language);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = async () => {
    setIsPlaying(true);
    
    // Simulate text-to-speech audio playback
    // In real implementation, this would use expo-speech or react-native-tts
    console.log(`Playing audio in ${language}: ${text}`);
    
    // Simulate audio duration based on text length
    const audioDuration = Math.max(2000, text.length * 50); // Minimum 2 seconds
    
    setTimeout(() => {
      setIsPlaying(false);
    }, audioDuration);
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.container,
        isPlaying && styles.playing
      ]}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel || t.listenToDescription}
      accessibilityRole="button"
      disabled={isPlaying}
    >
      <Text style={[
        styles.speakerIcon,
        { color: isPlaying ? "#4CAF50" : "#666666" }
      ]}>
        {isPlaying ? '🔊' : '🔈'}
      </Text>
      {isPlaying && (
        <Text style={styles.playingText}>{t.playing}</Text>
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
  playing: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  speakerIcon: {
    fontSize: 24,
  },
  playingText: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 4,
  },
}); 