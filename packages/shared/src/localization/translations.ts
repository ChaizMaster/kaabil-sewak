import { Language } from '../types/user.types';

export interface Translations {
  // Welcome & Onboarding
  welcome: string;
  selectLanguage: string;
  continue: string;
  getStarted: string;
  
  // Authentication
  signUp: string;
  login: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  
  // Profile Setup
  profileSetup: string;
  tellUsAboutYou: string;
  selectSkills: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  saveProfile: string;
  
  // Job Discovery
  jobsNearYou: string;
  perDay: string;
  away: string;
  apply: string;
  applied: string;
  requirements: string;
  viewDetails: string;
  
  // Audio Features
  listenToDescription: string;
  playing: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;
  next: string;
  back: string;
  skip: string;
  done: string;
  
  // Skills
  construction: string;
  delivery: string;
  security: string;
  cleaning: string;
  cooking: string;
  gardening: string;
  electrician: string;
  plumber: string;
  painter: string;
  driver: string;
}

export const translations: Record<Language, Translations> = {
  [Language.ENGLISH]: {
    // Welcome & Onboarding
    welcome: 'Welcome to Kaabil Sewak',
    selectLanguage: 'Select Your Language',
    continue: 'Continue',
    getStarted: 'Get Started',
    
    // Authentication
    signUp: 'Sign Up',
    login: 'Login',
    name: 'Full Name',
    phone: 'Phone Number',
    email: 'Email (Optional)',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account? Login',
    dontHaveAccount: "Don't have an account? Sign Up",
    
    // Profile Setup
    profileSetup: 'Complete Your Profile',
    tellUsAboutYou: 'Tell us about yourself',
    selectSkills: 'Select Your Skills',
    location: 'Your Location',
    address: 'Address',
    city: 'City',
    state: 'State',
    pincode: 'PIN Code',
    saveProfile: 'Save Profile',
    
    // Job Discovery
    jobsNearYou: 'Jobs Near You',
    perDay: '/day',
    away: 'away',
    apply: 'Apply',
    applied: 'Applied',
    requirements: 'Requirements',
    viewDetails: 'View Details',
    
    // Audio Features
    listenToDescription: 'Listen to Description',
    playing: 'Playing...',
    
    // Common
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    cancel: 'Cancel',
    confirm: 'Confirm',
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
    done: 'Done',
    
    // Skills
    construction: 'Construction',
    delivery: 'Delivery',
    security: 'Security',
    cleaning: 'Cleaning',
    cooking: 'Cooking',
    gardening: 'Gardening',
    electrician: 'Electrician',
    plumber: 'Plumber',
    painter: 'Painter',
    driver: 'Driver',
  },
  
  [Language.HINDI]: {
    // Welcome & Onboarding
    welcome: 'काबिल सेवक में आपका स्वागत है',
    selectLanguage: 'अपनी भाषा चुनें',
    continue: 'आगे बढ़ें',
    getStarted: 'शुरू करें',
    
    // Authentication
    signUp: 'साइन अप करें',
    login: 'लॉग इन करें',
    name: 'पूरा नाम',
    phone: 'फोन नंबर',
    email: 'ईमेल (वैकल्पिक)',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है? लॉग इन करें',
    dontHaveAccount: 'खाता नहीं है? साइन अप करें',
    
    // Profile Setup
    profileSetup: 'अपनी प्रोफ़ाइल पूरी करें',
    tellUsAboutYou: 'अपने बारे में बताएं',
    selectSkills: 'अपने कौशल चुनें',
    location: 'आपका स्थान',
    address: 'पता',
    city: 'शहर',
    state: 'राज्य',
    pincode: 'पिन कोड',
    saveProfile: 'प्रोफ़ाइल सेव करें',
    
    // Job Discovery
    jobsNearYou: 'आपके पास की नौकरियां',
    perDay: '/दिन',
    away: 'दूर',
    apply: 'आवेदन करें',
    applied: 'आवेदन किया',
    requirements: 'आवश्यकताएं',
    viewDetails: 'विवरण देखें',
    
    // Audio Features
    listenToDescription: 'विवरण सुनें',
    playing: 'गायन हो रहा है...',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हुआ',
    success: 'सफलता!',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    next: 'अगला',
    back: 'वापस',
    skip: 'छोड़ें',
    done: 'हो गया',
    
    // Skills
    construction: 'निर्माण',
    delivery: 'डिलीवरी',
    security: 'सुरक्षा',
    cleaning: 'सफाई',
    cooking: 'खाना बनाना',
    gardening: 'बागवानी',
    electrician: 'इलेक्ट्रीशियन',
    plumber: 'प्लंबर',
    painter: 'पेंटर',
    driver: 'ड्राइवर',
  },
  
  [Language.BENGALI]: {
    // Welcome & Onboarding
    welcome: 'কাবিল সেবকে স্বাগতম',
    selectLanguage: 'আপনার ভাষা নির্বাচন করুন',
    continue: 'এগিয়ে যান',
    getStarted: 'শুরু করুন',
    
    // Authentication
    signUp: 'সাইন আপ',
    login: 'লগইন',
    name: 'পুরো নাম',
    phone: 'ফোন নম্বর',
    email: 'ইমেইল (ঐচ্ছিক)',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন',
    dontHaveAccount: 'অ্যাকাউন্ট নেই? সাইন আপ করুন',
    
    // Profile Setup
    profileSetup: 'আপনার প্রোফাইল সম্পূর্ণ করুন',
    tellUsAboutYou: 'নিজের সম্পর্কে বলুন',
    selectSkills: 'আপনার দক্ষতা নির্বাচন করুন',
    location: 'আপনার অবস্থান',
    address: 'ঠিকানা',
    city: 'শহর',
    state: 'রাজ্য',
    pincode: 'পিন কোড',
    saveProfile: 'প্রোফাইল সংরক্ষণ করুন',
    
    // Job Discovery
    jobsNearYou: 'আপনার কাছের চাকরি',
    perDay: '/দিন',
    away: 'দূরে',
    apply: 'আবেদন করুন',
    applied: 'আবেদন করা হয়েছে',
    requirements: 'প্রয়োজনীয়তা',
    viewDetails: 'বিস্তারিত দেখুন',
    
    // Audio Features
    listenToDescription: 'বিবরণ শুনতে',
    playing: 'গান শুনছি...',
    
    // Common
    loading: 'লোড হচ্ছে...',
    error: 'কিছু ভুল হয়েছে',
    success: 'সফল!',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত করুন',
    next: 'পরবর্তী',
    back: 'ফিরে যান',
    skip: 'এড়িয়ে যান',
    done: 'সম্পন্ন',
    
    // Skills
    construction: 'নির্মাণ',
    delivery: 'ডেলিভারি',
    security: 'নিরাপত্তা',
    cleaning: 'পরিষ্কার',
    cooking: 'রান্না',
    gardening: 'বাগান',
    electrician: 'ইলেকট্রিশিয়ান',
    plumber: 'প্লাম্বার',
    painter: 'চিত্রশিল্পী',
    driver: 'চালক',
  },
}; 