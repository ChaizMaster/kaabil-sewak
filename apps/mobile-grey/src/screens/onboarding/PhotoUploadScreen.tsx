import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../../context/LanguageContext';

type OnboardingStackParamList = {
  PhotoUpload: { name?: string; businessName?: string; mobileNumber?: string; city?: string };
  Location: { name?: string; businessName?: string; mobileNumber?: string; photoUri?: string; city?: string };
};

type PhotoUploadNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'PhotoUpload'
>;
type PhotoUploadRouteProp = RouteProp<OnboardingStackParamList, 'PhotoUpload'>;

const translations = {
  english: {
    title: 'Set Your Business Profile Photo',
    subtitle: 'A clear photo or logo builds trust with candidates',
    welcome: 'Welcome',
    takePhoto: 'Take Photo',
    choosePhoto: 'Choose from Gallery',
    skip: 'Skip for Now',
    cameraSubtitle: 'Use your camera to take a new photo',
    gallerySubtitle: 'Choose an existing photo from your device',
    photoTips: 'Photo Tips',
    tip1: '🌟 Use bright, natural lighting',
    tip2: '📐 Keep the image clear and focused',
    tip3: '🎯 Show your business logo or professional image',
    usePhoto: 'Use This Photo',
    retake: 'Retake',
    uploadingText: 'Uploading...',
    cameraError: 'Camera Error',
    cameraErrorMessage: 'Unable to access camera. Please check permissions.',
    galleryError: 'Gallery Error',
    galleryErrorMessage: 'Unable to access gallery. Please check permissions.',
  },
  hindi: {
    title: 'अपना बिजनेस प्रोफ़ाइल फोटो सेट करें',
    subtitle: 'एक स्पष्ट तस्वीर या लोगो उम्मीदवारों के साथ विश्वास बनाता है',
    welcome: 'स्वागत है',
    takePhoto: 'फोटो लें',
    choosePhoto: 'गैलरी से चुनें',
    skip: 'अभी छोड़ें',
    cameraSubtitle: 'नई फोटो लेने के लिए अपने कैमरे का उपयोग करें',
    gallerySubtitle: 'अपने डिवाइस से मौजूदा फोटो चुनें',
    photoTips: 'फोटो टिप्स',
    tip1: '🌟 चमकदार, प्राकृतिक प्रकाश का उपयोग करें',
    tip2: '📐 छवि को स्पष्ट और केंद्रित रखें',
    tip3: '🎯 अपना बिजनेस लोगो या पेशेवर छवि दिखाएं',
    usePhoto: 'इस फोटो का उपयोग करें',
    retake: 'फिर से लें',
    uploadingText: 'अपलोड हो रहा है...',
    cameraError: 'कैमरा त्रुटि',
    cameraErrorMessage: 'कैमरा तक पहुंच नहीं मिल सकी। कृपया अनुमतियां जांचें।',
    galleryError: 'गैलरी त्रुटि',
    galleryErrorMessage: 'गैलरी तक पहुंच नहीं मिल सकी। कृपया अनुमतियां जांचें।',
  },
  bengali: {
    title: 'আপনার ব্যবসার প্রোফাইল ছবি সেট করুন',
    subtitle: 'একটি পরিষ্কার ছবি বা লোগো প্রার্থীদের সাথে বিশ্বাস তৈরি করে',
    welcome: 'স্বাগতম',
    takePhoto: 'ছবি তুলুন',
    choosePhoto: 'গ্যালারি থেকে নির্বাচন করুন',
    skip: 'এখন এড়িয়ে যান',
    cameraSubtitle: 'নতুন ছবি তুলতে আপনার ক্যামেরা ব্যবহার করুন',
    gallerySubtitle: 'আপনার ডিভাইস থেকে একটি বিদ্যমান ছবি নির্বাচন করুন',
    photoTips: 'ছবির টিপস',
    tip1: '🌟 উজ্জ্বল, প্রাকৃতিক আলো ব্যবহার করুন',
    tip2: '📐 ছবিটি পরিষ্কার এবং কেন্দ্রীভূত রাখুন',
    tip3: '🎯 আপনার ব্যবসার লোগো বা পেশাদার ছবি দেখান',
    usePhoto: 'এই ছবি ব্যবহার করুন',
    retake: 'আবার তুলুন',
    uploadingText: 'আপলোড হচ্ছে...',
    cameraError: 'ক্যামেরা ত্রুটি',
    cameraErrorMessage: 'ক্যামেরা অ্যাক্সেস করতে অক্ষম। অনুগ্রহ করে অনুমতিগুলি পরীক্ষা করুন।',
    galleryError: 'গ্যালারি ত্রুটি',
    galleryErrorMessage: 'গ্যালারি অ্যাক্সেস করতে অক্ষম। অনুগ্রহ করে অনুমতিগুলি পরীক্ষা করুন।',
  },
};

const PhotoUploadScreen = () => {
  const navigation = useNavigation<PhotoUploadNavigationProp>();
  const route = useRoute<PhotoUploadRouteProp>();
  const { language } = useLanguage();
  const { name, businessName, mobileNumber, city } = route.params;
  // For login users, name might be undefined or 'User', handle gracefully
  const displayName = name && name !== 'User' ? name : undefined;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const t = translations[language];

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.cameraError, t.cameraErrorMessage);
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.galleryError, t.galleryErrorMessage);
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(t.cameraError, t.cameraErrorMessage);
    }
  };

  const chooseFromGallery = async () => {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing from gallery:', error);
      Alert.alert(t.galleryError, t.galleryErrorMessage);
    }
  };

  const handleUsePhoto = async () => {
    if (!selectedImage) return;

    setUploading(true);
    // Mock upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUploading(false);
    navigation.navigate('Location', { name, businessName, mobileNumber, photoUri: selectedImage, city });
  };

  const handleRetake = () => {
    setSelectedImage(null);
  };

  const handleSkip = () => {
    navigation.navigate('Location', { name, businessName, mobileNumber, photoUri: undefined, city });
  };

  if (selectedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerPreview}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>
        <View style={styles.contentPreview}>
          <View style={styles.photoPreviewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.photoPreview}
            />
          </View>

          <View style={styles.actionContainerPreview}>
            <TouchableOpacity
              style={[
                styles.glassButton,
                styles.useButton,
                uploading && styles.glassButtonDisabled,
              ]}
              onPress={handleUsePhoto}
              disabled={uploading}
              activeOpacity={0.8}
            >
              {uploading ? (
                <>
                  <ActivityIndicator
                    color="#F0F4F8"
                    size="small"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.glassButtonText} numberOfLines={2}>{t.uploadingText}</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color="#F0F4F8"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.glassButtonText} numberOfLines={2}>{t.usePhoto}</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.glassButton, styles.retakeButton]}
              onPress={handleRetake}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="refresh"
                size={24}
                color="#F0F4F8"
                style={styles.buttonIcon}
              />
              <Text style={styles.glassButtonText} numberOfLines={2}>{t.retake}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcome}>
            {displayName ? (
              <>
                {t.welcome}, <Text style={styles.userNameText}>{displayName}</Text>!
              </>
            ) : (
              t.welcome
            )}
            👋
          </Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        <ScrollView style={styles.mainContent}>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="photo-camera"
                size={32}
                color="#F0F4F8"
                style={styles.buttonIcon}
              />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.glassButtonText} numberOfLines={2}>{t.takePhoto}</Text>
                <Text style={styles.glassButtonTextSecondary} numberOfLines={3}>
                  {t.cameraSubtitle}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={chooseFromGallery}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="photo-library"
                size={32}
                color="#F0F4F8"
                style={styles.buttonIcon}
              />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.glassButtonText} numberOfLines={2}>{t.choosePhoto}</Text>
                <Text style={styles.glassButtonTextSecondary} numberOfLines={3}>
                  {t.gallerySubtitle}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.skipButtonContainer}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>{t.skip}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>{t.photoTips}</Text>
            <Text style={styles.tipText}>{t.tip1}</Text>
            <Text style={styles.tipText}>{t.tip2}</Text>
            <Text style={styles.tipText}>{t.tip3}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  contentPreview: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  headerPreview: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
    color: '#A0AEC0',
    marginBottom: 12,
    textAlign: 'center',
  },
  userNameText: {
    color: '#F0F4F8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
  },
  optionsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  glassButton: {
    backgroundColor: 'rgba(23, 42, 70, 0.7)',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.25)',
    minHeight: 90,
  },
  buttonIcon: {
    marginRight: 20,
    flexShrink: 0,
  },
  buttonTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  glassButtonText: {
    color: '#F0F4F8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  glassButtonTextSecondary: {
    color: '#A0AEC0',
    fontSize: 14,
    marginTop: 4,
  },
  skipButtonContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  skipButton: {
    backgroundColor: 'transparent',
    padding: 15,
    paddingHorizontal: 30,
  },
  skipButtonText: {
    color: '#A0AEC0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsContainer: {
    padding: 20,
    backgroundColor: 'rgba(23, 42, 70, 0.5)',
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  tipsTitle: {
    color: '#F0F4F8',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tipText: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 5,
  },
  photoPreviewContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  actionContainerPreview: {
    width: '100%',
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    width: '80%',
  },
  retakeButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    width: '80%',
    borderColor: '#A0AEC0',
  },
  glassButtonDisabled: {
    backgroundColor: '#1E40AF',
  },
});

export default PhotoUploadScreen; 