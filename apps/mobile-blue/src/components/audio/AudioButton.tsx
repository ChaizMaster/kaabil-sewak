import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface AudioButtonProps {
  testID?: string;
  text: string;
  language?: Language;
  accessibilityLabel?: string;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  testID,
  text,
  language = Language.ENGLISH,
  accessibilityLabel,
  onAudioStart,
  onAudioEnd
}) => {
  const { t } = useTranslation(language);
  const [isPlaying, setIsPlaying] = useState(false);

  const getLanguageCode = (lang: Language): string => {
    switch (lang) {
      case Language.HINDI:
        return 'hi'; // Simplified code for better compatibility
      case Language.BENGALI:
        return 'bn'; // Simplified code for better compatibility
      case Language.ENGLISH:
      default:
        return 'en';
    }
  };

  // Extract text in the target language only
  const getLocalizedTextForSpeech = (text: string, lang: Language): string => {
    if (lang === Language.ENGLISH) {
      return text;
    }

    // For bilingual text, extract only the local language part
    if (text.includes(' / ')) {
      const parts = text.split(' / ');
      // Return the first part (local language) for Hindi/Bengali
      return parts[0];
    }

    return text;
  };

  const handlePress = async () => {
    if (isPlaying) {
      // Stop current speech
      Speech.stop();
      setIsPlaying(false);
      onAudioEnd?.();
      return;
    }

    try {
      setIsPlaying(true);
      onAudioStart?.();

      // Get available voices first
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Available voices:', voices.map(v => `${v.language} - ${v.name}`));

      const targetLanguage = getLanguageCode(language);
      const speechText = getLocalizedTextForSpeech(text, language);
      
      console.log(`TTS Language: ${targetLanguage}, Text: ${speechText}`);

      // Find a voice for the target language
      const targetVoice = voices.find(voice => 
        voice.language.startsWith(targetLanguage)
      );

      const speechOptions: any = {
        language: targetLanguage,
        pitch: 1.0,
        rate: 0.7, // Slower for better comprehension
        onDone: () => {
          setIsPlaying(false);
          onAudioEnd?.();
        },
        onStopped: () => {
          setIsPlaying(false);
          onAudioEnd?.();
        },
        onError: (error: any) => {
          console.warn('Speech error:', error);
          // Fallback to English if target language fails
          if (targetLanguage !== 'en') {
            console.log('Fallback to English TTS');
            Speech.speak(text, {
              language: 'en',
              pitch: 1.0,
              rate: 0.7,
              onDone: () => {
                setIsPlaying(false);
                onAudioEnd?.();
              },
              onStopped: () => {
                setIsPlaying(false);
                onAudioEnd?.();
              },
            });
          } else {
            setIsPlaying(false);
            onAudioEnd?.();
          }
        },
      };

      // Use specific voice if available
      if (targetVoice) {
        speechOptions.voice = targetVoice.identifier;
        console.log(`Using voice: ${targetVoice.name} (${targetVoice.language})`);
      } else {
        console.log(`No voice found for ${targetLanguage}, using default`);
      }

      await Speech.speak(speechText, speechOptions);
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      onAudioEnd?.();
    }
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