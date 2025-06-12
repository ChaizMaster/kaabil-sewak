import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');

type PhotoAngle = 'front' | 'left' | 'right';

interface CapturedPhoto {
  uri: string;
  angle: PhotoAngle;
  timestamp: number;
}

interface WorkerVerificationCameraProps {
  visible: boolean;
  onClose: () => void;
  onPhotosComplete: (photos: CapturedPhoto[]) => void;
  workerName?: string;
}

const translations = {
  english: {
    title: 'Worker Verification Photos',
    subtitle: 'Capture clear photos from different angles',
    frontAngle: 'Front View',
    leftAngle: 'Left Profile',
    rightAngle: 'Right Profile',
    captureInstruction: 'Position the worker as shown and tap to capture',
    retake: 'Retake',
    continue: 'Continue',
    complete: 'Complete Verification',
    allPhotosRequired: 'All 3 photos are required for verification',
    cameraPermissionTitle: 'Camera Permission Required',
    cameraPermissionMessage: 'Please allow camera access to capture verification photos.',
    cameraError: 'Camera Error',
    cameraErrorMessage: 'Unable to access camera. Please check permissions.',
    photoCapture: 'Tap to capture',
    photoProgress: '{{current}} of {{total}} photos taken',
    switchCamera: 'Switch Camera',
    closeCamera: 'Close Camera',
    guideTitle: 'Photo Guidelines',
    guideFront: '• Worker should face the camera directly',
    guideLeft: '• Worker should turn their head to the left',
    guideRight: '• Worker should turn their head to the right',
    guideGeneral: '• Ensure good lighting and clear visibility',
  },
  hindi: {
    title: 'कर्मचारी सत्यापन फोटो',
    subtitle: 'विभिन्न कोणों से स्पष्ट तस्वीरें लें',
    frontAngle: 'सामने का दृश्य',
    leftAngle: 'बाएं प्रोफ़ाइल',
    rightAngle: 'दाएं प्रोफ़ाइल',
    captureInstruction: 'कर्मचारी को दिखाए गए अनुसार रखें और कैप्चर करने के लिए टैप करें',
    retake: 'फिर से लें',
    continue: 'जारी रखें',
    complete: 'सत्यापन पूरा करें',
    allPhotosRequired: 'सत्यापन के लिए सभी 3 फोटो आवश्यक हैं',
    cameraPermissionTitle: 'कैमरा अनुमति आवश्यक',
    cameraPermissionMessage: 'सत्यापन फोटो कैप्चर करने के लिए कैमरा एक्सेस की अनुमति दें।',
    cameraError: 'कैमरा त्रुटि',
    cameraErrorMessage: 'कैमरा तक पहुंच नहीं मिल सकी। कृपया अनुमतियां जांचें।',
    photoCapture: 'कैप्चर करने के लिए टैप करें',
    photoProgress: '{{total}} में से {{current}} फोटो लिए गए',
    switchCamera: 'कैमरा बदलें',
    closeCamera: 'कैमरा बंद करें',
    guideTitle: 'फोटो दिशानिर्देश',
    guideFront: '• कर्मचारी को सीधे कैमरे की ओर देखना चाहिए',
    guideLeft: '• कर्मचारी को अपना सिर बाईं ओर मोड़ना चाहिए',
    guideRight: '• कर्मचारी को अपना सिर दाईं ओर मोड़ना चाहिए',
    guideGeneral: '• अच्छी रोशनी और स्पष्ट दृश्यता सुनिश्चित करें',
  },
  bengali: {
    title: 'কর্মী যাচাইকরণ ছবি',
    subtitle: 'বিভিন্ন কোণ থেকে স্পষ্ট ছবি তুলুন',
    frontAngle: 'সামনের দৃশ্য',
    leftAngle: 'বাম প্রোফাইল',
    rightAngle: 'ডান প্রোফাইল',
    captureInstruction: 'কর্মীকে দেখানোর মতো অবস্থান করুন এবং ক্যাপচারের জন্য ট্যাপ করুন',
    retake: 'আবার তুলুন',
    continue: 'চালিয়ে যান',
    complete: 'যাচাইকরণ সম্পূর্ণ করুন',
    allPhotosRequired: 'যাচাইকরণের জন্য সব ৩টি ছবি প্রয়োজন',
    cameraPermissionTitle: 'ক্যামেরা অনুমতি প্রয়োজন',
    cameraPermissionMessage: 'যাচাইকরণ ছবি তুলতে ক্যামেরা অ্যাক্সেসের অনুমতি দিন।',
    cameraError: 'ক্যামেরা ত্রুটি',
    cameraErrorMessage: 'ক্যামেরা অ্যাক্সেস করতে অক্ষম। অনুগ্রহ করে অনুমতিগুলি পরীক্ষা করুন।',
    photoCapture: 'ক্যাপচারের জন্য ট্যাপ করুন',
    photoProgress: '{{total}} এর মধ্যে {{current}} টি ছবি তোলা হয়েছে',
    switchCamera: 'ক্যামেরা পরিবর্তন করুন',
    closeCamera: 'ক্যামেরা বন্ধ করুন',
    guideTitle: 'ছবির নির্দেশনা',
    guideFront: '• কর্মীর সরাসরি ক্যামেরার দিকে তাকানো উচিত',
    guideLeft: '• কর্মীর বাম দিকে মাথা ঘুরানো উচিত',
    guideRight: '• কর্মীর ডান দিকে মাথা ঘুরানো উচিত',
    guideGeneral: '• ভাল আলো এবং স্পষ্ট দৃশ্যমানতা নিশ্চিত করুন',
  },
};

export const WorkerVerificationCamera: React.FC<WorkerVerificationCameraProps> = ({
  visible,
  onClose,
  onPhotosComplete,
  workerName = 'Worker',
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [currentAngle, setCurrentAngle] = useState<PhotoAngle>('front');
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  
  const cameraRef = useRef<CameraView>(null);

  const angleSequence: PhotoAngle[] = ['front', 'left', 'right'];
  const currentAngleIndex = angleSequence.indexOf(currentAngle);
  const totalPhotos = angleSequence.length;
  const capturedCount = capturedPhotos.length;

  useEffect(() => {
    if (visible) {
      // Fire analytics event when verification starts
      console.log('Analytics: VerificationStarted', { workerName, timestamp: Date.now() });
      
      if (!permission?.granted && permission?.canAskAgain) {
        requestPermission();
      }
    }
  }, [visible, workerName, permission]);

  const getAngleLabel = (angle: PhotoAngle): string => {
    switch (angle) {
      case 'front':
        return t.frontAngle;
      case 'left':
        return t.leftAngle;
      case 'right':
        return t.rightAngle;
      default:
        return '';
    }
  };

  const getAngleIcon = (angle: PhotoAngle): string => {
    switch (angle) {
      case 'front':
        return 'face';
      case 'left':
        return 'rotate-left';
      case 'right':
        return 'rotate-right';
      default:
        return 'face';
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: Platform.OS === 'android',
      });

      const newPhoto: CapturedPhoto = {
        uri: photo.uri,
        angle: currentAngle,
        timestamp: Date.now(),
      };

      const updatedPhotos = [...capturedPhotos, newPhoto];
      setCapturedPhotos(updatedPhotos);

      // Move to next angle or complete
      if (currentAngleIndex < angleSequence.length - 1) {
        setCurrentAngle(angleSequence[currentAngleIndex + 1]);
      } else {
        // All photos captured
        setTimeout(() => {
          onPhotosComplete(updatedPhotos);
        }, 500);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert(t.cameraError, t.cameraErrorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  const retakeCurrentPhoto = () => {
    // Remove the current angle's photo if it exists
    const filteredPhotos = capturedPhotos.filter(photo => photo.angle !== currentAngle);
    setCapturedPhotos(filteredPhotos);
  };

  const retakeFromAngle = (angle: PhotoAngle) => {
    // Remove all photos from this angle onwards
    const angleIndex = angleSequence.indexOf(angle);
    const filteredPhotos = capturedPhotos.filter(photo => {
      const photoIndex = angleSequence.indexOf(photo.angle);
      return photoIndex < angleIndex;
    });
    setCapturedPhotos(filteredPhotos);
    setCurrentAngle(angle);
  };

  const isAngleCaptured = (angle: PhotoAngle): boolean => {
    return capturedPhotos.some(photo => photo.angle === angle);
  };

  if (permission?.granted === null) {
    return <View />;
  }

  if (permission?.granted === false) {
    return (
      <Modal visible={visible} animationType="slide" style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.permissionContainer}>
            <MaterialIcons name="camera-alt" size={64} color="#B0BEC5" />
            <Text style={styles.permissionTitle}>{t.cameraPermissionTitle}</Text>
            <Text style={styles.permissionMessage}>{t.cameraPermissionMessage}</Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Allow Camera Access</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>
              {t.photoProgress
                .replace('{{current}}', String(capturedCount))
                .replace('{{total}}', String(totalPhotos))}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setFacing(
              facing === 'back' ? 'front' : 'back'
            )}
            style={styles.switchButton}
          >
            <MaterialIcons name="flip-camera-ios" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Guide Modal */}
        {showGuide && (
          <View style={styles.guideOverlay}>
            <View style={styles.guideContainer}>
              <Text style={styles.guideTitle}>{t.guideTitle}</Text>
              <Text style={styles.guideText}>{t.guideFront}</Text>
              <Text style={styles.guideText}>{t.guideLeft}</Text>
              <Text style={styles.guideText}>{t.guideRight}</Text>
              <Text style={styles.guideText}>{t.guideGeneral}</Text>
              <TouchableOpacity
                style={styles.guideButton}
                onPress={() => setShowGuide(false)}
              >
                <Text style={styles.guideButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            {/* Angle Indicator */}
            <View style={styles.angleIndicator}>
              <MaterialIcons
                name={getAngleIcon(currentAngle) as keyof typeof MaterialIcons.glyphMap}
                size={32}
                color="#FFFFFF"
              />
              <Text style={styles.angleText}>{getAngleLabel(currentAngle)}</Text>
            </View>

            {/* Face Guide Overlay */}
            <View style={styles.faceGuide} />

            {/* Instruction Text */}
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>{t.captureInstruction}</Text>
            </View>
          </CameraView>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {angleSequence.map((angle, index) => (
            <TouchableOpacity
              key={angle}
              style={[
                styles.progressDot,
                angle === currentAngle && styles.progressDotActive,
                isAngleCaptured(angle) && styles.progressDotCompleted,
              ]}
              onPress={() => retakeFromAngle(angle)}
            >
              <MaterialIcons
                name={isAngleCaptured(angle) ? 'check' : getAngleIcon(angle) as keyof typeof MaterialIcons.glyphMap}
                size={20}
                color={isAngleCaptured(angle) ? '#4CAF50' : angle === currentAngle ? '#2196F3' : '#B0BEC5'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {isAngleCaptured(currentAngle) && (
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={retakeCurrentPhoto}
            >
              <MaterialIcons name="refresh" size={24} color="#FF5722" />
              <Text style={styles.retakeButtonText}>{t.retake}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={capturePhoto}
            disabled={isCapturing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {capturedCount === totalPhotos && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => onPhotosComplete(capturedPhotos)}
            >
              <MaterialIcons name="check" size={24} color="#FFFFFF" />
              <Text style={styles.completeButtonText}>{t.complete}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0BEC5',
  },
  switchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  guideContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    margin: 20,
    maxWidth: width * 0.9,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
    textAlign: 'center',
  },
  guideText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 22,
  },
  guideButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
  },
  guideButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  angleIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    paddingVertical: 15,
  },
  angleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  faceGuide: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    bottom: '35%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  progressDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  progressDotActive: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  progressDotCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  retakeButton: {
    position: 'absolute',
    left: 30,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#FF5722',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E0E0E0',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
  },
  completeButton: {
    position: 'absolute',
    right: 30,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
});

export type { CapturedPhoto, PhotoAngle }; 