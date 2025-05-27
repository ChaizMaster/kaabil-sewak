import '@testing-library/jest-native/extend-expect';

// Mock shared hooks
jest.mock('shared/src/hooks/useTranslation', () => ({
  useTranslation: jest.fn((lang) => ({
    t: {
      selectLanguage: lang === 'hi' ? 'अपनी भाषा चुनें' :
        lang === 'bn' ? 'আপনার ভাষা নির্বাচন করুন' :
          'Select Your Language',
      continue: lang === 'hi' ? 'आगे बढ़ें' :
        lang === 'bn' ? 'এগিয়ে যান' :
          'Continue',
      name: lang === 'hi' ? 'नाम' : lang === 'bn' ? 'নাম' : 'Name',
      phone: lang === 'hi' ? 'फोन नंबर' : lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number',
      photo: lang === 'hi' ? 'फोटो' : lang === 'bn' ? 'ছবি' : 'Photo',
      signUp: lang === 'hi' ? 'साइन अप करें' : lang === 'bn' ? 'সাইন আপ করুন' : 'Sign Up',
      apply: lang === 'hi' ? 'आवेदन करें' : lang === 'bn' ? 'আবেদন করুন' : 'Apply',
      requirements: lang === 'hi' ? 'आवश्यकताएं:' : lang === 'bn' ? 'প্রয়োজনীয়তা:' : 'Requirements:',
      uploadPhoto: lang === 'hi' ? 'फोटो अपलोड करें' : lang === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Photo',
      takePhoto: lang === 'hi' ? 'फोटो लें' : lang === 'bn' ? 'ছবি তুলুন' : 'Take Photo',
      chooseFromGallery: lang === 'hi' ? 'गैलरी से चुनें' : lang === 'bn' ? 'গ্যালারি থেকে বেছে নিন' : 'Choose from Gallery',
      cancel: lang === 'hi' ? 'रद्द करें' : lang === 'bn' ? 'বাতিল করুন' : 'Cancel',
      getLocation: lang === 'hi' ? 'स्थान प्राप्त करें' : lang === 'bn' ? 'অবস্থান পান' : 'Get Location',
      enterManually: lang === 'hi' ? 'मैन्युअल रूप से दर्ज करें' : lang === 'bn' ? 'ম্যানুয়ালি প্রবেশ করান' : 'Enter Manually',
      address: lang === 'hi' ? 'पता' : lang === 'bn' ? 'ঠিকানা' : 'Address',
      city: lang === 'hi' ? 'शहर' : lang === 'bn' ? 'শহর' : 'City',
      state: lang === 'hi' ? 'राज्य' : lang === 'bn' ? 'রাজ্য' : 'State',
      pincode: lang === 'hi' ? 'पिन कोड' : lang === 'bn' ? 'পিন কোড' : 'Pin Code',
    },
    currentLanguage: lang,
    availableLanguages: ['en', 'hi', 'bn'],
  })),
}));

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

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      }
    })
  ),
  reverseGeocodeAsync: jest.fn(() =>
    Promise.resolve([{
      street: '123 Test St',
      city: 'Test City',
      region: 'Test Region',
      postalCode: '12345',
      country: 'Test Country',
    }])
  ),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
})); 