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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

interface PhotoUploadScreenProps {
  onPhotoUploaded: (photoUri: string) => void;
  language: 'english' | 'hindi' | 'bengali';
  userName: string;
}

const translations = {
  english: {
    title: 'Add Your Photo',
    subtitle: 'Your photo is required to complete registration',
    welcome: 'Welcome',
    takePhoto: 'Take Photo',
    choosePhoto: 'Choose from Gallery',
    cameraSubtitle: 'Use camera',
    gallerySubtitle: 'Select from gallery',
    uploadingText: 'Uploading photo...',
    photoTips: 'Tips for a good photo:',
    tip1: '• Face should be clearly visible',
    tip2: '• Good lighting preferred',
    tip3: '• Avoid sunglasses or hats',
    retake: 'Retake Photo',
    usePhoto: 'Use This Photo',
    cameraPermission: 'Camera Permission',
    cameraPermissionMessage: 'We need camera permission to take your photo',
    galleryPermission: 'Gallery Permission',
    galleryPermissionMessage: 'We need gallery permission to select your photo',
    cameraError: 'Camera Error',
    cameraErrorMessage: 'Could not open camera. Please try again.',
    galleryError: 'Gallery Error',
    galleryErrorMessage: 'Could not open gallery. Please try again.',
    uploadError: 'Upload Error',
    uploadErrorMessage: 'Failed to upload photo. Please try again.',
  },
  hindi: {
    title: 'अपनी तस्वीर जोड़ें',
    subtitle: 'पंजीकरण पूरा करने के लिए आपकी तस्वीर आवश्यक है',
    welcome: 'स्वागत है',
    takePhoto: 'तस्वीर लें',
    choosePhoto: 'गैलरी से चुनें',
    cameraSubtitle: 'कैमरा का उपयोग करें',
    gallerySubtitle: 'गैलरी से चुनें',
    uploadingText: 'तस्वीर अपलोड हो रही है...',
    photoTips: 'अच्छी तस्वीर के लिए सुझाव:',
    tip1: '• चेहरा साफ दिखना चाहिए',
    tip2: '• अच्छी रोशनी हो',
    tip3: '• चश्मा या टोपी न पहनें',
    retake: 'दोबारा तस्वीर लें',
    usePhoto: 'इस तस्वीर का उपयोग करें',
    cameraPermission: 'कैमरा की अनुमति',
    cameraPermissionMessage: 'तस्वीर लेने के लिए कैमरा की अनुमति चाहिए',
    galleryPermission: 'गैलरी की अनुमति',
    galleryPermissionMessage: 'तस्वीर चुनने के लिए गैलरी की अनुमति चाहिए',
    cameraError: 'कैमरा त्रुटि',
    cameraErrorMessage: 'कैमरा नहीं खुल सका। कृपया पुनः प्रयास करें।',
    galleryError: 'गैलरी त्रुटि',
    galleryErrorMessage: 'गैलरी नहीं खुल सकी। कृपया पुनः प्रयास करें।',
    uploadError: 'अपलोड त्रुटि',
    uploadErrorMessage: 'तस्वीर अपलोड नहीं हो सकी। कृपया पुनः प्रयास करें।',
  },
  bengali: {
    title: 'আপনার ছবি যোগ করুন',
    subtitle: 'নিবন্ধন সম্পূর্ণ করতে আপনার ছবি প্রয়োজন',
    welcome: 'স্বাগতম',
    takePhoto: 'ছবি তুলুন',
    choosePhoto: 'গ্যালারি থেকে বেছে নিন',
    cameraSubtitle: 'ক্যামেরা ব্যবহার করুন',
    gallerySubtitle: 'গ্যালারি থেকে নির্বাচন করুন',
    uploadingText: 'ছবি আপলোড হচ্ছে...',
    photoTips: 'ভাল ছবির জন্য টিপস:',
    tip1: '• মুখ স্পষ্টভাবে দেখা যেতে হবে',
    tip2: '• ভাল আলো পছন্দনীয়',
    tip3: '• সানগ্লাস বা টুপি এড়িয়ে চলুন',
    retake: 'আবার ছবি তুলুন',
    usePhoto: 'এই ছবি ব্যবহার করুন',
    cameraPermission: 'ক্যামেরার অনুমতি',
    cameraPermissionMessage: 'আপনার ছবি তুলতে ক্যামেরার অনুমতি প্রয়োজন',
    galleryPermission: 'গ্যালারির অনুমতি',
    galleryPermissionMessage: 'আপনার ছবি নির্বাচন করতে গ্যালারির অনুমতি প্রয়োজন',
    cameraError: 'ক্যামেরা ত্রুটি',
    cameraErrorMessage: 'ক্যামেরা খুলতে পারছে না। দয়া করে আবার চেষ্টা করুন।',
    galleryError: 'গ্যালারি ত্রুটি',
    galleryErrorMessage: 'গ্যালারি খুলতে পারছে না। দয়া করে আবার চেষ্টা করুন।',
    uploadError: 'আপলোড ত্রুটি',
    uploadErrorMessage: 'ছবি আপলোড করতে ব্যর্থ। দয়া করে আবার চেষ্টা করুন।',
  },
};

export const PhotoUploadScreen: React.FC<PhotoUploadScreenProps> = ({
  onPhotoUploaded,
  language,
  userName,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const t = translations[language];

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.cameraPermission, t.cameraPermissionMessage);
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.galleryPermission, t.galleryPermissionMessage);
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
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
        mediaTypes: ["images"],
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
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPhotoUploaded(selectedImage);
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert(t.uploadError, t.uploadErrorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
  };

  if (selectedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentPreview}>
          <View style={styles.headerPreview}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>

          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.photoPreview} />
          </View>

          <View style={styles.actionContainerPreview}>
            <TouchableOpacity
              style={[styles.glassButton, styles.useButton, uploading && styles.glassButtonDisabled]}
              onPress={handleUsePhoto}
              disabled={uploading}
              activeOpacity={0.8}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color="#F0F4F8" size="small" style={styles.buttonIcon} />
                  <Text style={styles.glassButtonText}>{t.uploadingText}</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="check-circle" size={24} color="#F0F4F8" style={styles.buttonIcon} />
                  <Text style={styles.glassButtonText}>{t.usePhoto}</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.glassButton, styles.retakeButton]}
              onPress={handleRetake}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <MaterialIcons name="refresh" size={24} color="#F0F4F8" style={styles.buttonIcon} />
              <Text style={styles.glassButtonTextSecondary}>{t.retake}</Text>
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
            {t.welcome}, <Text style={styles.userNameText}>{userName}</Text>! 👋
          </Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.glassButton} onPress={takePhoto} activeOpacity={0.8}>
            <MaterialIcons name="photo-camera" size={24} color="#F055A8" style={styles.buttonIcon} />
            <View style={styles.optionTextContainer}>
                <Text style={styles.glassButtonText}>{t.takePhoto}</Text>
                <Text style={styles.glassButtonSubtitle}>{t.cameraSubtitle}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.glassButton} onPress={chooseFromGallery} activeOpacity={0.8}>
            <MaterialIcons name="photo-library" size={24} color="#304FFE" style={styles.buttonIcon} />
            <View style={styles.optionTextContainer}>
                <Text style={styles.glassButtonText}>{t.choosePhoto}</Text>
                <Text style={styles.glassButtonSubtitle}>{t.gallerySubtitle}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>{t.photoTips}</Text>
          <Text style={styles.tipText}>{t.tip1}</Text>
          <Text style={styles.tipText}>{t.tip2}</Text>
          <Text style={styles.tipText}>{t.tip3}</Text>
        </View>
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
    paddingVertical: 20,
    justifyContent: 'space-around',
  },
  contentPreview: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerPreview: {
    alignItems: 'center',
    marginTop: 20,
  },
  welcome: {
    fontSize: 26,
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 10,
  },
  userNameText: {
    color: '#F055A8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  optionsContainer: {
    marginVertical: 20,
  },
  glassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 42, 70, 0.65)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.2)',
    minHeight: 58,
  },
  glassButtonDisabled: {
    backgroundColor: 'rgba(23, 42, 70, 0.3)',
  },
  buttonIcon: {
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  glassButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  glassButtonTextSecondary: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F0F4F8',
  },
  glassButtonSubtitle: {
    fontSize: 13,
    color: '#A0AEC0',
    marginTop: 2,
  },
  tipsContainer: {
    padding: 20,
    backgroundColor: 'rgba(23, 42, 70, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.15)',
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 6,
    lineHeight: 20,
  },
  photoPreviewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  photoPreview: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 5,
    borderColor: 'rgba(240, 244, 248, 0.6)',
  },
  actionContainerPreview: {
    paddingBottom: 10,
  },
  retakeButton: {
    backgroundColor: 'rgba(160, 174, 192, 0.35)',
    borderColor: 'rgba(240, 244, 248, 0.15)',
    justifyContent: 'center',
    marginBottom: 12,
  },
  useButton: {
    backgroundColor: 'rgba(48, 79, 254, 0.75)',
    borderColor: 'rgba(240, 244, 248, 0.35)',
    justifyContent: 'center',
  },
}); 