import '@testing-library/jest-native/extend-expect';

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));



jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: 'granted' })
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: 'granted' })
  ),
  launchCameraAsync: jest.fn(() => 
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mock-photo-uri' }]
    })
  ),
  launchImageLibraryAsync: jest.fn(() => 
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mock-photo-uri' }]
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
})); 