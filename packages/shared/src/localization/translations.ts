import { Language } from '../types/user.types';

export interface Translations {
  [key: string]: string;
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
  password: string;
  confirmPassword: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  
  // Photo Upload
  photo: string;
  uploadPhoto: string;
  takePhoto: string;
  chooseFromGallery: string;
  photoRequired: string;
  photoIdentityCaption: string;
  retakePhoto: string;
  permissionsRequired: string;
  permissionsRequiredMessage: string;
  cameraError: string;
  cameraErrorMessage: string;
  galleryError: string;
  galleryErrorMessage: string;
  noCaptureError: string;
  noSelectionError: string;
  unknownError: string;
  tryAgain: string;
  ok: string;
  
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
  noJobsAvailable: string;
  
  // Job Titles
  constructionWorker: string;
  houseCleaning: string;
  deliveryHelper: string;
  maintenanceWork: string;
  kitchenHelper: string;
  securityGuard: string;
  
  // Job Descriptions
  constructionWorkerDesc: string;
  houseCleaningDesc: string;
  deliveryHelperDesc: string;
  maintenanceWorkDesc: string;
  kitchenHelperDesc: string;
  securityGuardDesc: string;
  
  // Location text
  kmAway: string;
  
  // App Navigation
  exitApp: string;
  exitAppMessage: string;
  noStay: string;
  yesExit: string;
  
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
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account? Login',
    dontHaveAccount: "Don't have an account? Sign Up",
    
    // Photo Upload
    photo: 'Photo',
    uploadPhoto: 'Upload Photo',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    photoRequired: 'Photo is required',
    photoIdentityCaption: 'Please upload your photo or take a selfie to uniquely identify you, as names can be common. This helps us ensure you are a genuine worker.',
    retakePhoto: 'Retake Photo',
    permissionsRequired: 'Permissions Required',
    permissionsRequiredMessage: 'We need camera and photo library permissions to upload your photo.',
    cameraError: 'Camera Error',
    cameraErrorMessage: 'Could not open camera',
    galleryError: 'Gallery Error',
    galleryErrorMessage: 'Could not open gallery',
    noCaptureError: 'No photo was captured. Please try again.',
    noSelectionError: 'No photo was selected. Please try again.',
    unknownError: 'Unknown error',
    tryAgain: 'Please try again.',
    ok: 'OK',
    
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
    noJobsAvailable: 'No jobs available',
    
    // Job Titles
    constructionWorker: '🔨 Construction Worker',
    houseCleaning: '🏠 House Cleaning',
    deliveryHelper: '🚚 Delivery Helper',
    maintenanceWork: '🔧 Maintenance Work',
    kitchenHelper: '🍳 Kitchen Helper',
    securityGuard: '🛡️ Security Guard',
    
    // Job Descriptions
    constructionWorkerDesc: 'Building construction site work. Experience preferred.',
    houseCleaningDesc: 'Regular house cleaning work. Flexible timing.',
    deliveryHelperDesc: 'Loading and unloading delivery trucks.',
    maintenanceWorkDesc: 'General maintenance and repair work.',
    kitchenHelperDesc: 'Restaurant kitchen assistance. Food preparation.',
    securityGuardDesc: 'Protecting and securing premises.',
    
    // Location text
    kmAway: 'km away',
    
    // App Navigation
    exitApp: 'Exit App',
    exitAppMessage: 'Are you sure you want to exit the app?',
    noStay: 'No, stay in the app',
    yesExit: 'Yes, exit the app',
    
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
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है? लॉग इन करें',
    dontHaveAccount: 'खाता नहीं है? साइन अप करें',
    
    // Photo Upload
    photo: 'फोटो',
    uploadPhoto: 'फोटो अपलोड करें',
    takePhoto: 'फोटो लें',
    chooseFromGallery: 'गैलरी से चुनें',
    photoRequired: 'फोटो आवश्यक है',
    photoIdentityCaption: 'कृपया अपनी फोटो अपलोड करें या सेल्फी लें ताकि आपकी पहचान हो सके, क्योंकि नाम समान हो सकते हैं। यह हमें यह सुनिश्चित करने में मदद करता है कि आप एक वास्तविक कामगार हैं।',
    retakePhoto: 'फोटो फिर से लें',
    permissionsRequired: 'अनुमति आवश्यक',
    permissionsRequiredMessage: 'फोटो अपलोड करने के लिए हमें कैमरा और फोटो लाइब्रेरी की अनुमति चाहिए।',
    cameraError: 'कैमरा त्रुटि',
    cameraErrorMessage: 'कैमरा नहीं खुल सका',
    galleryError: 'गैलरी त्रुटि',
    galleryErrorMessage: 'गैलरी नहीं खुल सकी',
    noCaptureError: 'कोई फोटो नहीं ली गई। कृपया पुनः प्रयास करें।',
    noSelectionError: 'कोई फोटो नहीं चुनी गई। कृपया पुनः प्रयास करें।',
    unknownError: 'अज्ञात त्रुटि',
    tryAgain: 'कृपया पुनः प्रयास करें।',
    ok: 'ठीक है',
    
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
    noJobsAvailable: 'कोई नौकरी उपलब्ध नहीं है',
    
    // Job Titles
    constructionWorker: '🔨 निर्माण कामगार',
    houseCleaning: '🏠 घर की सफाई',
    deliveryHelper: '🚚 डिलीवरी सहायक',
    maintenanceWork: '🔧 रखरखाव का काम',
    kitchenHelper: '🍳 रसोई सहायक',
    securityGuard: '🛡️ सुरक्षा गार्ड',
    
    // Job Descriptions
    constructionWorkerDesc: 'भवन निर्माण साइट का काम। अनुभव प्राथमिकता।',
    houseCleaningDesc: 'नियमित घर की सफाई का काम। लचीला समय।',
    deliveryHelperDesc: 'डिलीवरी ट्रकों की लोडिंग और अनलोडिंग।',
    maintenanceWorkDesc: 'सामान्य रखरखाव और मरम्मत का काम।',
    kitchenHelperDesc: 'रेस्टोरेंट रसोई सहायता। खाना तैयार करना।',
    securityGuardDesc: 'व्यवस्था को सुरक्षित रखने का काम।',
    
    // Location text
    kmAway: 'किमी दूर',
    
    // App Navigation
    exitApp: 'ऐप निकालें',
    exitAppMessage: 'क्या आप वाकई ऐप निकालना चाहते हैं?',
    noStay: 'नहीं, ऐप में रहें',
    yesExit: 'हाँ, ऐप निकालें',
    
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
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন',
    dontHaveAccount: 'অ্যাকাউন্ট নেই? সাইন আপ করুন',
    
    // Photo Upload
    photo: 'ফটো',
    uploadPhoto: 'ফটো আপলোড করুন',
    takePhoto: 'ফটো তুলুন',
    chooseFromGallery: 'গ্যালারি থেকে চয়ন করুন',
    photoRequired: 'ফটো আবশ্যক',
    photoIdentityCaption: 'অনুগ্রহ করে আপনার ফটো আপলোড করুন বা সেলফি তুলুন যাতে আপনাকে অনন্যভাবে চিহ্নিত করা যায়, কারণ নাম সাধারণ হতে পারে। এটি আমাদের নিশ্চিত করতে সাহায্য করে যে আপনি একজন প্রকৃত কর্মী।',
    retakePhoto: 'ফটো পুনরায় তুলুন',
    permissionsRequired: 'অনুমতি প্রয়োজন',
    permissionsRequiredMessage: 'ফটো আপলোড করার জন্য আমাদের ক্যামেরা এবং ফটো লাইব্রেরির অনুমতি প্রয়োজন।',
    cameraError: 'ক্যামেরা ত্রুটি',
    cameraErrorMessage: 'ক্যামেরা খুলতে পারছে না',
    galleryError: 'গ্যালারি ত্রুটি',
    galleryErrorMessage: 'গ্যালারি খুলতে পারছে না',
    noCaptureError: 'কোনো ফটো তোলা হয়নি। দয়া করে আবার চেষ্টা করুন।',
    noSelectionError: 'কোনো ফটো নির্বাচিত হয়নি। দয়া করে আবার চেষ্টা করুন।',
    unknownError: 'অজানা ত্রুটি',
    tryAgain: 'দয়া করে আবার চেষ্টা করুন।',
    ok: 'ঠিক আছে',
    
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
    noJobsAvailable: 'কোনো নিয়োগ উপলব্ধ নয়',
    
    // Job Titles
    constructionWorker: '🔨 নির্মাণ কর্মী',
    houseCleaning: '🏠 বাড়ি পরিষ্কার',
    deliveryHelper: '🚚 ডেলিভারি সহায়ক',
    maintenanceWork: '🔧 রক্ষণাবেক্ষণ কাজ',
    kitchenHelper: '🍳 রান্নাঘর সহায়ক',
    securityGuard: '🛡️ সম্পত্তি গার্ড',
    
    // Job Descriptions
    constructionWorkerDesc: 'ভবন নির্মাণ সাইটের কাজ। অভিজ্ঞতা অগ্রাধিকার।',
    houseCleaningDesc: 'নিয়মিত বাড়ি পরিষ্কারের কাজ। নমনীয় সময়।',
    deliveryHelperDesc: 'ডেলিভারি ট্রাক লোডিং এবং আনলোডিং।',
    maintenanceWorkDesc: 'সাধারণ রক্ষণাবেক্ষণ এবং মেরামতের কাজ।',
    kitchenHelperDesc: 'রেস্তোরাঁ রান্নাঘর সহায়তা। খাবার প্রস্তুতি।',
    securityGuardDesc: 'প্রতিরোধ করার কাজ।',
    
    // Location text
    kmAway: 'কিমি দূরে',
    
    // App Navigation
    exitApp: 'অ্যাপ থেকে বেরিয়ে যান',
    exitAppMessage: 'আপনি কি সত্যিই অ্যাপ থেকে বেরিয়ে যেতে চান?',
    noStay: 'না, অ্যাপে থাকুন',
    yesExit: 'হ্যাঁ, অ্যাপ থেকে বেরিয়ে যান',
    
    // Common
    loading: 'লোড হচ্ছে...',
    error: 'কিছু ভুল হয়েছে',
    success: 'সফল!',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত করুন',
    next: 'পরবর্তী',
    back: 'পেছনে',
    skip: 'এড়িয়ে যান',
    done: 'সম্পন্ন',
    
    // Skills
    construction: 'নির্মাণ',
    delivery: 'ডেলিভারি',
    security: 'নিরাপত্তা',
    cleaning: 'পরিচ্ছন্নতা',
    cooking: 'রান্না',
    gardening: 'বাগান করা',
    electrician: 'ইলেকট্রিশিয়ান',
    plumber: 'প্লাম্বার',
    painter: 'চিত্রকর',
    driver: 'চালক',
  },
}; 