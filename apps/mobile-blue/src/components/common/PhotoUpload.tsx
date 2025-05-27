import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Language } from 'shared/src/types/user.types';
import { useTranslation } from 'shared/src/hooks/useTranslation';

interface PhotoUploadProps {
  onPhotoSelected: (photoUri: string) => void;
  language: Language;
  selectedPhoto?: string;
  error?: string;
}

const { width } = Dimensions.get('window');

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelected,
  language,
  selectedPhoto,
  error,
}) => {
  const { t } = useTranslation(language);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const requestPermissions = async () => {
    console.log('Requesting camera and media library permissions...');
    
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    console.log('Camera permission status:', cameraStatus);
    console.log('Media library permission status:', mediaLibraryStatus);
    
    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      console.log('Permissions denied - Camera:', cameraStatus, 'Media Library:', mediaLibraryStatus);
      Alert.alert(
        'Permissions Required',
        'We need camera and photo library permissions to upload your photo.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    console.log('All permissions granted');
    return true;
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      console.log('Attempting to launch camera...');
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
        base64: false,
        exif: false,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Photo taken successfully:', result.assets[0].uri);
        onPhotoSelected(result.assets[0].uri);
        setIsModalVisible(false);
      } else if (result.canceled) {
        console.log('User canceled photo capture');
      } else {
        console.log('No assets returned from camera');
        Alert.alert('Error', 'No photo was captured. Please try again.');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Camera Error', 
        `Failed to take photo: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      );
    }
  };

  const chooseFromGallery = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      console.log('Attempting to launch image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.7,
        base64: false,
        exif: false,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Photo selected successfully:', result.assets[0].uri);
        onPhotoSelected(result.assets[0].uri);
        setIsModalVisible(false);
      } else if (result.canceled) {
        console.log('User canceled photo selection');
      } else {
        console.log('No assets returned from gallery');
        Alert.alert('Error', 'No photo was selected. Please try again.');
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert(
        'Gallery Error', 
        `Failed to select photo: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t.photo} *</Text>
      
      {/* Caption explaining why photo is needed */}
      <Text style={styles.caption}>{t.photoIdentityCaption}</Text>

      {/* Photo preview or upload button */}
      <TouchableOpacity
        testID="photo-upload-button"
        style={[styles.photoContainer, error && styles.photoContainerError]}
        onPress={() => setIsModalVisible(true)}
        accessibilityLabel={selectedPhoto ? t.retakePhoto : t.uploadPhoto}
      >
        {selectedPhoto ? (
          <View style={styles.photoPreview}>
            <Image source={{ uri: selectedPhoto }} style={styles.photo} />
            <View style={styles.photoOverlay}>
              <Text style={styles.retakeText}>{t.retakePhoto}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>{t.uploadPhoto}</Text>
          </View>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Photo selection modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.uploadPhoto}</Text>
            
            <TouchableOpacity
              testID="take-photo-button"
              style={styles.modalButton}
              onPress={takePhoto}
            >
              <Text style={styles.modalButtonIcon}>📸</Text>
              <Text style={styles.modalButtonText}>{t.takePhoto}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="choose-gallery-button"
              style={styles.modalButton}
              onPress={chooseFromGallery}
            >
              <Text style={styles.modalButtonIcon}>🖼️</Text>
              <Text style={styles.modalButtonText}>{t.chooseFromGallery}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="cancel-photo-button"
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  caption: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  photoContainer: {
    height: 200,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoContainerError: {
    borderColor: '#D32F2F',
  },
  photoPreview: {
    flex: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    alignItems: 'center',
  },
  retakeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  uploadIcon: {
    fontSize: 48,
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    gap: 12,
  },
  modalButtonIcon: {
    fontSize: 24,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#FFE6E6',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#D32F2F',
    textAlign: 'center',
    flex: 1,
  },
}); 