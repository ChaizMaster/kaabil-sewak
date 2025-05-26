import '@testing-library/jest-native/extend-expect';

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
  stop: jest.fn(),
}));

jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(() => 
      Promise.resolve({ status: 'granted' })
    ),
    setAudioModeAsync: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
})); 