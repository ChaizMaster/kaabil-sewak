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

      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
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

      console.log('Launching gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
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
      // Simulate upload delay
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
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>

          {/* Photo Preview */}
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.photoPreview} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton]}
              onPress={handleRetake}
              disabled={uploading}
            >
              <Text style={styles.retakeButtonText}>{t.retake}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.useButton, uploading && styles.useButtonDisabled]}
              onPress={handleUsePhoto}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                  <Text style={styles.useButtonText}>{t.uploadingText}</Text>
                </>
              ) : (
                <Text style={styles.useButtonText}>{t.usePhoto}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>
            {t.welcome}, {userName}! 👋
          </Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        {/* Photo Options */}
        <View style={styles.photoOptions}>
          {/* Take Photo Button */}
          <TouchableOpacity
            style={styles.photoOption}
            onPress={takePhoto}
            activeOpacity={0.7}
          >
            <View style={styles.photoOptionContent}>
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.photoOptionTitle}>{t.takePhoto}</Text>
                <Text style={styles.photoOptionSubtitle}>{t.cameraSubtitle}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Choose from Gallery Button */}
          <TouchableOpacity
            style={styles.photoOption}
            onPress={chooseFromGallery}
            activeOpacity={0.7}
          >
            <View style={styles.photoOptionContent}>
              <View style={styles.galleryIconContainer}>
                <Text style={styles.galleryIcon}>🖼️</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.photoOptionTitle}>{t.choosePhoto}</Text>
                <Text style={styles.photoOptionSubtitle}>{t.gallerySubtitle}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Photo Tips */}
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
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  photoOptions: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  photoOption: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  photoOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  cameraIconContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  galleryIconContainer: {
    backgroundColor: '#28a745',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  cameraIcon: {
    fontSize: 28,
    color: '#fff',
  },
  galleryIcon: {
    fontSize: 28,
    color: '#fff',
  },
  optionTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  photoOptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  photoOptionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  photoPreviewContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  actionContainer: {
    paddingVertical: 20,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  retakeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#666',
  },
  retakeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  useButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  useButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
}); 