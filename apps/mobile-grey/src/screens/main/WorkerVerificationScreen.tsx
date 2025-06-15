import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLanguage } from '../../context/LanguageContext';
import { WorkerVerificationCamera, CapturedPhoto } from '../../components/verification/WorkerVerificationCamera';
import { VerificationForm, VerificationFormData } from '../../components/verification/VerificationForm';
import VerificationService, { UploadProgress, VerificationRecord } from '../../services/verificationService';
import { commonStyles, theme } from '../../styles/common';

const { width } = Dimensions.get('window');

interface IDDocumentPhoto {
  uri: string;
  timestamp: number;
  documentType: 'front' | 'back';
}

const idDocTranslations = {
  english: {
    title: 'Capture ID Document',
    subtitle: 'Place the document inside the frame',
    capture: 'Capture',
    retake: 'Retake',
    usePhoto: 'Use Photo',
    permissionTitle: 'Camera Permission Needed',
    permissionMessage: 'This feature requires camera access to capture ID documents.',
    allow: 'Allow',
    deny: 'Deny',
  },
  hindi: {
    title: 'आईडी दस्तावेज़ कैप्चर करें',
    subtitle: 'दस्तावेज़ को फ्रेम के अंदर रखें',
    capture: 'कैप्चर',
    retake: 'फिर से लें',
    usePhoto: 'फोटो का उपयोग करें',
    permissionTitle: 'कैमरा अनुमति आवश्यक',
    permissionMessage: 'इस सुविधा के लिए आईडी दस्तावेज़ कैप्चर करने हेतु कैमरा एक्सेस की आवश्यकता है।',
    allow: 'अनुमति दें',
    deny: 'अस्वीकार करें',
  },
  bengali: {
    title: 'আইডি ডকুমেন্ট ক্যাপচার করুন',
    subtitle: 'ফ্রেমের ভিতরে ডকুমেন্ট রাখুন',
    capture: 'ক্যাপচার',
    retake: 'আবার তুলুন',
    usePhoto: 'ছবি ব্যবহার করুন',
    permissionTitle: 'ক্যামেরার অনুমতি প্রয়োজন',
    permissionMessage: 'এই বৈশিষ্ট্যের জন্য আইডি ডকুমেন্ট ক্যাপচার করতে ক্যামেরা অ্যাক্সেস প্রয়োজন।',
    allow: 'অনুমতি দিন',
    deny: 'অস্বীকার করুন',
  },
};

interface IDDocumentCameraProps {
  visible: boolean;
  onClose: () => void;
  onDocumentCaptured: (photo: IDDocumentPhoto) => void;
  workerName?: string;
  documentType: 'front' | 'back';
}

const IDDocumentCamera: React.FC<IDDocumentCameraProps> = ({
  visible,
  onClose,
  onDocumentCaptured,
  documentType,
}) => {
  const { language } = useLanguage();
  const t = idDocTranslations[language];
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent>
        <View style={idCameraStyles.modalContainer}>
          <View style={idCameraStyles.permissionContainer}>
            <Text style={idCameraStyles.permissionTitle}>{t.permissionTitle}</Text>
            <Text style={idCameraStyles.permissionMessage}>{t.permissionMessage}</Text>
            <View style={idCameraStyles.permissionButtons}>
              <TouchableOpacity onPress={onClose} style={idCameraStyles.permissionButton}>
                <Text>{t.deny}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={requestPermission} style={[idCameraStyles.permissionButton, idCameraStyles.allowButton]}>
                <Text style={idCameraStyles.allowButtonText}>{t.allow}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const captureDocument = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setCapturedImage(photo.uri);
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onDocumentCaptured({
        uri: capturedImage,
        timestamp: Date.now(),
        documentType: documentType,
      });
      setCapturedImage(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={idCameraStyles.container}>
        {capturedImage ? (
          <View style={idCameraStyles.previewContainer}>
            <Image source={{ uri: capturedImage }} style={idCameraStyles.previewImage} />
            <View style={idCameraStyles.previewControls}>
              <TouchableOpacity style={idCameraStyles.controlButton} onPress={handleRetake}>
                <MaterialIcons name="refresh" size={32} color="white" />
                <Text style={idCameraStyles.controlText}>{t.retake}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={idCameraStyles.controlButton} onPress={handleUsePhoto}>
                <MaterialIcons name="check-circle" size={32} color="white" />
                <Text style={idCameraStyles.controlText}>{t.usePhoto}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView style={idCameraStyles.camera} ref={cameraRef}>
            <View style={idCameraStyles.overlay}>
              <View style={idCameraStyles.header}>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={30} color="white" />
                </TouchableOpacity>
              </View>
              <View style={idCameraStyles.guidelineBox}>
                <Text style={idCameraStyles.guidelineText}>{t.subtitle}</Text>
              </View>
              <View style={idCameraStyles.footer}>
                <TouchableOpacity style={idCameraStyles.captureButton} onPress={captureDocument}>
                  <MaterialIcons name="camera" size={40} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const idCameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  permissionContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  permissionMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButtons: {
    flexDirection: 'row',
  },
  permissionButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  allowButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 5,
  },
  allowButtonText: {
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
  },
  guidelineBox: {
    alignSelf: 'center',
    width: width * 0.9,
    height: width * 0.9 * (5.4 / 8.6), // Aadhar card aspect ratio
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidelineText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  captureButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    padding: 15,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    marginTop: 5,
  },
});

const translations = {
  english: {
    title: 'Worker Verification',
    subtitle: 'Verify worker identity on-site',
    startVerification: 'Start Photo Verification',
    verificationSteps: 'Verification Steps:',
    step1: '1. Take worker photos (3 angles)',
    step2: '2. Capture ID document',
    step3: '3. Fill verification form',
    step4: '4. Submit for processing',
    photosRequired: 'Worker Photos Required',
    photosDescription: 'Take clear photos of the worker from front, left, and right angles',
    continueToNext: 'Continue to ID Capture',
    workerName: 'Worker Name',
    workerNamePlaceholder: 'Enter worker full name',
    back: 'Back',
    cancel: 'Cancel',
    photosCompleted: 'Photos completed successfully!',
    nextStep: 'Next Step',
    idCaptureTitle: 'Capture ID Document',
    idCaptureSubtitle: 'Capture front and back of Aadhaar, Voter ID, or Driving License',
    captureFrontId: 'Capture Front of ID',
    captureBackId: 'Capture Back of ID',
    submissionFailedTitle: 'Submission Failed',
    tryAgain: 'Try Again',
    submittingTitle: 'Submitting Verification...',
    uploadProgress: 'Upload Progress',
    verificationCompleteTitle: 'Verification Submitted',
    verificationCompleteDesc: 'The verification has been submitted for review.',
    verifyAnotherWorker: 'Verify Another Worker',
    submissionSummary: 'Submission Summary',
    summaryIdType: 'ID Type',
    summaryIdNumber: 'ID Number',
    summaryBankAccount: 'Bank Account',
    summaryStatus: 'Status',
  },
  hindi: {
    title: 'कर्मचारी सत्यापन',
    subtitle: 'साइट पर कर्मचारी की पहचान सत्यापित करें',
    startVerification: 'फोटो सत्यापन शुरू करें',
    verificationSteps: 'सत्यापन चरण:',
    step1: '1. कर्मचारी की फोटो लें (3 कोण)',
    step2: '2. आईडी दस्तावेज़ कैप्चर करें',
    step3: '3. सत्यापन फॉर्म भरें',
    step4: '4. प्रसंस्करण के लिए सबमिट करें',
    photosRequired: 'कर्मचारी फोटो आवश्यक',
    photosDescription: 'कर्मचारी की सामने, बाएं और दाएं कोण से स्पष्ट तस्वीरें लें',
    continueToNext: 'आईडी कैप्चर पर जारी रखें',
    workerName: 'कर्मचारी का नाम',
    workerNamePlaceholder: 'कर्मचारी का पूरा नाम दर्ज करें',
    back: 'वापस',
    cancel: 'रद्द करें',
    photosCompleted: 'फोटो सफलतापूर्वक पूरी हुई!',
    nextStep: 'अगला चरण',
    idCaptureTitle: 'आईडी दस्तावेज़ कैप्चर करें',
    idCaptureSubtitle: 'आधार, वोटर आईडी, या ड्राइविंग लाइसेंस के आगे और पीछे का भाग कैप्चर करें',
    captureFrontId: 'आईडी का अगला भाग कैप्चर करें',
    captureBackId: 'आईडी का पिछला भाग कैप्चर करें',
    submissionFailedTitle: 'प्रस्तुत करने में विफल',
    tryAgain: 'पुनः प्रयास करें',
    submittingTitle: 'सत्यापन प्रस्तुत किया जा रहा है...',
    uploadProgress: 'अपलोड प्रगति',
    verificationCompleteTitle: 'सत्यापन प्रस्तुत किया गया',
    verificationCompleteDesc: 'सत्यापन समीक्षा के लिए प्रस्तुत किया गया है।',
    verifyAnotherWorker: 'किसी अन्य कर्मचारी को सत्यापित करें',
    submissionSummary: 'प्रस्तुत सारांश',
    summaryIdType: 'आईडी प्रकार',
    summaryIdNumber: 'आईडी संख्या',
    summaryBankAccount: 'बैंक खाता',
    summaryStatus: 'स्थिति',
  },
  bengali: {
    title: 'কর্মী যাচাইকরণ',
    subtitle: 'সাইটে কর্মীর পরিচয় যাচাই করুন',
    startVerification: 'ছবি যাচাইকরণ শুরু করুন',
    verificationSteps: 'যাচাইকরণের ধাপ:',
    step1: '১. কর্মীর ছবি তুলুন (৩ কোণ)',
    step2: '২. আইডি নথি ক্যাপচার করুন',
    step3: '৩. যাচাইকরণ ফর্ম পূরণ করুন',
    step4: '৪. প্রক্রিয়াকরণের জন্য জমা দিন',
    photosRequired: 'কর্মীর ছবি প্রয়োজন',
    photosDescription: 'সামনে, বাম এবং ডান কোণ থেকে কর্মীর স্পষ্ট ছবি তুলুন',
    continueToNext: 'আইডি ক্যাপচারে চালিয়ে যান',
    workerName: 'কর্মীর নাম',
    workerNamePlaceholder: 'কর্মীর পুরো নাম লিখুন',
    back: 'পিছনে',
    cancel: 'বাতিল',
    photosCompleted: 'ছবি সফলভাবে সম্পন্ন হয়েছে!',
    nextStep: 'পরবর্তী ধাপ',
    idCaptureTitle: 'আইডি ডকুমেন্ট ক্যাপচার করুন',
    idCaptureSubtitle: 'আধার, ভোটার আইডি বা ড্রাইভিং লাইসেন্সের সামনে ও পিছনের ছবি তুলুন',
    captureFrontId: 'আইডি-র সামনের ছবি তুলুন',
    captureBackId: 'আইডি-র পিছনের ছবি তুলুন',
    submissionFailedTitle: 'জমা দিতে ব্যর্থ হয়েছে',
    tryAgain: 'আবার চেষ্টা করুন',
    submittingTitle: 'যাচাইকরণ জমা দেওয়া হচ্ছে...',
    uploadProgress: 'আপলোড অগ্রগতি',
    verificationCompleteTitle: 'যাচাইকরণ জমা দেওয়া হয়েছে',
    verificationCompleteDesc: 'যাচাইকরণের জন্য আবেদন জমা দেওয়া হয়েছে।',
    verifyAnotherWorker: 'অন্য কর্মীর যাচাই করুন',
    submissionSummary: 'জমার সারসংক্ষেপ',
    summaryIdType: 'আইডি প্রকার',
    summaryIdNumber: 'আইডি নম্বর',
    summaryBankAccount: 'ব্যাঙ্ক অ্যাকাউন্ট',
    summaryStatus: 'স্ট্যাটাস',
  },
};

type VerificationStep = 'overview' | 'photos' | 'id_capture' | 'form' | 'complete';

const WorkerVerificationScreen: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('overview');
  const [workerPhotos, setWorkerPhotos] = useState<CapturedPhoto[]>([]);
  const [idDocuments, setIdDocuments] = useState<IDDocumentPhoto[]>([]);
  const [verificationData, setVerificationData] = useState<VerificationFormData | null>(null);
  const [showIdCamera, setShowIdCamera] = useState(false);
  const [idCaptureType, setIdCaptureType] = useState<'front' | 'back'>('front');
  const [workerName, setWorkerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [verificationRecord, setVerificationRecord] = useState<VerificationRecord | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleStartVerification = () => {
    if (!workerName.trim()) {
      Alert.alert('Error', 'Please enter worker name first');
      return;
    }
    setCurrentStep('photos');
  };

  const handlePhotosComplete = (photos: CapturedPhoto[]) => {
    setWorkerPhotos(photos);
    setCurrentStep('id_capture');
    
    // Show success message
    Alert.alert(
      'Success',
      t.photosCompleted,
      [{ text: 'OK', onPress: () => console.log('Photos saved:', photos.length) }]
    );
  };

  const handleCameraClose = () => {
    setCurrentStep('overview');
  };

  const handleStartIdCapture = (type: 'front' | 'back') => {
    setIdCaptureType(type);
    setShowIdCamera(true);
  };

  const handleIdDocumentCaptured = (document: IDDocumentPhoto) => {
    setIdDocuments(prev => {
      const newDocuments = [...prev.filter(doc => doc.documentType !== document.documentType), document];

      const hasFront = newDocuments.some(d => d.documentType === 'front');
      const hasBack = newDocuments.some(d => d.documentType === 'back');

      if (hasFront && hasBack) {
        setTimeout(() => setCurrentStep('form'), 0);
      }

      return newDocuments;
    });
    setShowIdCamera(false);
  };

  const handleIdCameraClose = () => {
    setShowIdCamera(false);
  };

  const handleFormSubmit = async (data: VerificationFormData) => {
    setCurrentStep('complete');
    setIsSubmitting(true);
    setUploadProgress(null);
    setSubmissionError(null);
    
    try {
      // Fire VerificationCompleted analytics event
      console.log('Analytics: VerificationCompleted', {
        workerName,
        photosCount: workerPhotos.length,
        documentsCount: idDocuments.length,
        idType: data.idType,
        timestamp: Date.now()
      });

      // Submit verification using the service
      const record = await VerificationService.submitVerification(
        {
          workerName,
          photos: workerPhotos,
          documents: idDocuments,
          formData: data,
          contractorId: 'contractor_123', // TODO: Get from auth context
          jobId: 'job_456', // TODO: Get from current job context
          location: {
            latitude: 0, // TODO: Get current location
            longitude: 0,
            address: 'Site Location'
          }
        },
        (progress: UploadProgress) => {
          setUploadProgress(progress);
        }
      );

      setVerificationRecord(record);
      setVerificationData(data);
      
      // Log successful verification
      console.log('Verification submitted successfully:', {
        id: record.id,
        workerName,
        status: record.status,
        photos: workerPhotos.length,
        documents: idDocuments.length,
      });
    } catch (error) {
      console.error('Verification submission failed:', error);
      setSubmissionError('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormBack = () => {
    setCurrentStep('id_capture');
  };

  const handleStartOver = () => {
    setCurrentStep('overview');
    setWorkerPhotos([]);
    setIdDocuments([]);
    setVerificationData(null);
    setWorkerName('');
    setVerificationRecord(null);
    setUploadProgress(null);
    setSubmissionError(null);
  };

  const renderOverviewStep = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <MaterialIcons name="verified-user" size={64} color={theme.colors.primary} />
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>{t.verificationSteps}</Text>
        <View style={styles.stepItem}>
          <MaterialIcons name="camera-alt" size={24} color={theme.colors.secondary} />
          <Text style={styles.stepText}>{t.step1}</Text>
        </View>
        <View style={styles.stepItem}>
          <MaterialIcons name="credit-card" size={24} color={theme.colors.secondary} />
          <Text style={styles.stepText}>{t.step2}</Text>
        </View>
        <View style={styles.stepItem}>
          <MaterialIcons name="edit" size={24} color={theme.colors.secondary} />
          <Text style={styles.stepText}>{t.step3}</Text>
        </View>
        <View style={styles.stepItem}>
          <MaterialIcons name="cloud-upload" size={24} color={theme.colors.secondary} />
          <Text style={styles.stepText}>{t.step4}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{t.workerName}</Text>
        <View style={styles.nameInputContainer}>
          <MaterialIcons name="person" size={24} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.nameInput}
            placeholder={t.workerNamePlaceholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={workerName}
            onChangeText={setWorkerName}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.startButton, !workerName.trim() && styles.disabledButton]}
        onPress={handleStartVerification}
        disabled={!workerName.trim()}
      >
        <Text style={styles.startButtonText}>{t.startVerification}</Text>
        <MaterialIcons name="arrow-forward" size={20} color={theme.colors.white} />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPhotosStep = () => {
    return (
      <WorkerVerificationCamera
        visible={currentStep === 'photos'}
        onClose={handleCameraClose}
        onPhotosComplete={handlePhotosComplete}
        workerName={workerName}
      />
    );
  };
  
  const renderIDCaptureStep = () => {
    const frontDoc = idDocuments.find(d => d.documentType === 'front');
    const backDoc = idDocuments.find(d => d.documentType === 'back');

    return (
      <Modal
        visible={currentStep === 'id_capture'}
        animationType="slide"
        onRequestClose={() => setCurrentStep('photos')}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
              <MaterialIcons name="badge" size={64} color={theme.colors.primary} />
              <Text style={styles.title}>{t.idCaptureTitle}</Text>
              <Text style={styles.subtitle}>{t.idCaptureSubtitle}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.documentButton, idDocuments.some(d => d.documentType === 'front') && styles.documentButtonCompleted]} 
              onPress={() => handleStartIdCapture('front')}
            >
              <MaterialIcons 
                name={frontDoc ? "check-circle" : "camera-alt"} 
                size={24} 
                color={theme.colors.white} 
              />
              <Text style={styles.documentButtonText}>{t.captureFrontId}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.documentButton, idDocuments.some(d => d.documentType === 'back') && styles.documentButtonCompleted]} 
              onPress={() => handleStartIdCapture('back')}
            >
              <MaterialIcons 
                name={backDoc ? "check-circle" : "camera-alt"} 
                size={24} 
                color={theme.colors.white} 
              />
              <Text style={styles.documentButtonText}>{t.captureBackId}</Text>
            </TouchableOpacity>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep('photos')}>
                <Text style={styles.buttonText}>{t.back}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderFormStep = () => (
    <VerificationForm
      onSubmit={handleFormSubmit}
      onBack={handleFormBack}
      initialWorkerName={workerName}
      isLoading={isSubmitting}
    />
  );
  
  const renderCompleteStep = () => {
    if (submissionError) {
      return (
        <View style={[styles.container, styles.contentContainer]}>
          <MaterialIcons name="error" size={64} color={theme.colors.error} />
          <Text style={styles.title}>{t.submissionFailedTitle}</Text>
          <Text style={styles.subtitle}>{submissionError}</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartOver}>
            <Text style={styles.buttonText}>{t.tryAgain}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isSubmitting) {
      const progress =
        uploadProgress && uploadProgress.total > 0
          ? (Number(uploadProgress.current) / Number(uploadProgress.total)) * 100
          : 0;

      return (
        <View style={[styles.container, styles.contentContainer]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.title}>{t.submittingTitle}</Text>
            {uploadProgress !== null && (
              <Text style={styles.progressText}>
                {t.uploadProgress}: {Math.round(progress)}%
              </Text>
            )}
          </View>
        </View>
      );
    }
    
    if (verificationRecord) {
      return (
        <View style={[styles.container, styles.contentContainer]}>
          <View style={styles.successIconContainer}>
            <MaterialIcons name="check-circle" size={80} color={theme.colors.success} />
          </View>
          <Text style={styles.completeTitle}>{t.verificationCompleteTitle}</Text>
          <Text style={styles.completeDescription}>{t.verificationCompleteDesc}</Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>{t.submissionSummary}</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t.workerName}</Text>
              <Text style={styles.summaryValue}>{verificationRecord.formData.workerName}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t.summaryIdType}</Text>
              <Text style={styles.summaryValue}>{verificationRecord.formData.idType}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t.summaryIdNumber}</Text>
              <Text style={styles.summaryValue}>{verificationRecord.formData.idNumber}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t.summaryBankAccount}</Text>
              <Text style={styles.summaryValue}>{verificationRecord.formData.bankAccountNumber}</Text>
            </View>
             <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t.summaryStatus}</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.secondary }]}>{verificationRecord.status}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleStartOver}>
            <Text style={styles.primaryButtonText}>{t.verifyAnotherWorker}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };
  
  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 'overview':
        return renderOverviewStep();
      case 'photos':
        return renderPhotosStep();
      case 'id_capture':
        return renderIDCaptureStep();
      case 'form':
        return renderFormStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}
      >
        <View style={commonStyles.container}>
          {getCurrentStepComponent()}
          {showIdCamera && (
            <IDDocumentCamera
              visible={showIdCamera}
              onClose={handleIdCameraClose}
              onDocumentCaptured={handleIdDocumentCaptured}
              workerName={workerName}
              documentType={idCaptureType}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flexContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  stepsTitle: {
    ...theme.typography.h3,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    ...theme.typography.body,
    marginLeft: 12,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 8,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 15,
  },
  nameInput: {
    ...theme.typography.body,
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginLeft: 10,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#1E40AF',
    opacity: 0.7,
  },
  startButtonText: {
    ...theme.typography.button,
    marginRight: 8,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  continueButtonText: {
    ...theme.typography.button,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completeTitle: {
    ...theme.typography.h2,
    marginBottom: 16,
    textAlign: 'center',
  },
  completeMessage: {
    ...theme.typography.body,
    marginBottom: 20,
    textAlign: 'center',
  },
  completeDescription: {
    ...theme.typography.body,
    marginBottom: 20,
    textAlign: 'center',
  },
  startOverButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startOverButtonText: {
    ...theme.typography.button,
  },
  idCaptureContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  idCaptureTitle: {
    ...theme.typography.h2,
    marginBottom: 8,
  },
  idCaptureSubtitle: {
    ...theme.typography.body,
    marginBottom: 30,
  },
  idCardContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    width: '100%',
  },
  idCardText: {
    ...theme.typography.body,
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 20,
    width: '80%',
  },
  progressBarBackground: {
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    height: 6,
  },
  progressBarForeground: {
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
    height: '100%',
  },
  progressText: {
    ...theme.typography.body,
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    ...theme.typography.h3,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    ...theme.typography.body,
    marginRight: 8,
  },
  summaryValue: {
    ...theme.typography.body,
  },
  documentButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  documentButtonCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  documentButtonText: {
    ...theme.typography.body,
    marginLeft: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  backButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#1E40AF',
  },
  buttonText: {
    ...theme.typography.button,
  },
  summaryBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    ...theme.typography.button,
  },
});

export default WorkerVerificationScreen; 