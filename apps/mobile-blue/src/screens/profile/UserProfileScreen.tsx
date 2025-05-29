import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfileScreenProps {
  userLanguage: 'english' | 'hindi' | 'bengali';
  userData: {
    isAuthenticated: boolean;
    language: 'english' | 'hindi' | 'bengali';
    signupData?: {
      fullName: string;
      phoneNumber: string;
      city: string;
    };
    photoUri?: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
  };
  onGoBack: () => void;
  onProfileUpdated: (updatedData: any) => void;
}

const translations = {
  english: {
    title: 'My Profile',
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    city: 'City',
    photo: 'Profile Photo',
    location: 'Current Location',
    changePhoto: 'Change Photo',
    takePhoto: 'Take New Photo',
    choosePhoto: 'Choose from Gallery',
    save: 'Save Changes',
    cancel: 'Cancel',
    edit: 'Edit',
    done: 'Done',
    verifyPhone: 'Verify New Number',
    phoneChangeWarning: 'Changing phone number requires OTP verification',
    otpSent: 'OTP Sent',
    enterOtp: 'Enter OTP',
    verify: 'Verify',
    resendOtp: 'Resend OTP',
    profileUpdated: 'Profile Updated Successfully',
    invalidOtp: 'Invalid OTP',
    back: 'Back',
  },
  hindi: {
    title: 'मेरी प्रोफाइल',
    editProfile: 'प्रोफाइल संपादित करें',
    personalInfo: 'व्यक्तिगत जानकारी',
    fullName: 'पूरा नाम',
    phoneNumber: 'फोन नंबर',
    city: 'शहर',
    photo: 'प्रोफाइल फोटो',
    location: 'वर्तमान स्थान',
    changePhoto: 'फोटो बदलें',
    takePhoto: 'नई फोटो लें',
    choosePhoto: 'गैलरी से चुनें',
    save: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    done: 'हो गया',
    verifyPhone: 'नया नंबर सत्यापित करें',
    phoneChangeWarning: 'फोन नंबर बदलने के लिए OTP सत्यापन आवश्यक है',
    otpSent: 'OTP भेजा गया',
    enterOtp: 'OTP दर्ज करें',
    verify: 'सत्यापित करें',
    resendOtp: 'OTP पुनः भेजें',
    profileUpdated: 'प्रोफाइल सफलतापूर्वक अपडेट हुई',
    invalidOtp: 'गलत OTP',
    back: 'वापस',
  },
  bengali: {
    title: 'আমার প্রোফাইল',
    editProfile: 'প্রোফাইল সম্পাদনা করুন',
    personalInfo: 'ব্যক্তিগত তথ্য',
    fullName: 'পূর্ণ নাম',
    phoneNumber: 'ফোন নম্বর',
    city: 'শহর',
    photo: 'প্রোফাইল ছবি',
    location: 'বর্তমান অবস্থান',
    changePhoto: 'ছবি পরিবর্তন করুন',
    takePhoto: 'নতুন ছবি তুলুন',
    choosePhoto: 'গ্যালারি থেকে নির্বাচন করুন',
    save: 'পরিবর্তন সংরক্ষণ করুন',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    done: 'সম্পন্ন',
    verifyPhone: 'নতুন নম্বর যাচাই করুন',
    phoneChangeWarning: 'ফোন নম্বর পরিবর্তনের জন্য OTP যাচাইকরণ প্রয়োজন',
    otpSent: 'OTP পাঠানো হয়েছে',
    enterOtp: 'OTP প্রবেশ করুন',
    verify: 'যাচাই করুন',
    resendOtp: 'OTP পুনরায় পাঠান',
    profileUpdated: 'প্রোফাইল সফলভাবে আপডেট হয়েছে',
    invalidOtp: 'ভুল OTP',
    back: 'ফিরে যান',
  },
};

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  userLanguage,
  userData,
  onGoBack,
  onProfileUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData.signupData?.fullName || '');
  const [editedCity, setEditedCity] = useState(userData.signupData?.city || '');
  const [editedPhone, setEditedPhone] = useState(userData.signupData?.phoneNumber || '');
  const [editedPhoto, setEditedPhoto] = useState(userData.photoUri || '');
  const [isPhoneVerification, setIsPhoneVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const t = translations[userLanguage];

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original values if canceling
      setEditedName(userData.signupData?.fullName || '');
      setEditedCity(userData.signupData?.city || '');
      setEditedPhone(userData.signupData?.phoneNumber || '');
      setEditedPhoto(userData.photoUri || '');
    }
    setIsEditing(!isEditing);
  };

  const handlePhotoChange = async () => {
    Alert.alert(
      t.changePhoto,
      '',
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.takePhoto, onPress: takePhoto },
        { text: t.choosePhoto, onPress: chooseFromGallery },
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setEditedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const chooseFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setEditedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  const handlePhoneChange = () => {
    if (editedPhone !== userData.signupData?.phoneNumber) {
      Alert.alert(
        t.phoneChangeWarning,
        '',
        [
          { text: t.cancel, style: 'cancel' },
          { text: t.verifyPhone, onPress: sendOTP },
        ]
      );
    }
  };

  const sendOTP = async () => {
    // Simulate OTP sending
    setOtpSent(true);
    setIsPhoneVerification(true);
    Alert.alert(t.otpSent, `OTP sent to ${editedPhone}`);
  };

  const verifyOTP = async () => {
    // Simulate OTP verification (you can replace with actual logic)
    if (otpCode === '123456' || otpCode === '1234') {
      setIsPhoneVerification(false);
      setOtpSent(false);
      setOtpCode('');
      saveProfile();
    } else {
      Alert.alert(t.invalidOtp);
    }
  };

  const saveProfile = async () => {
    try {
      const updatedUserData = {
        ...userData,
        signupData: {
          ...userData.signupData,
          fullName: editedName,
          phoneNumber: editedPhone,
          city: editedCity,
        },
        photoUri: editedPhoto,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUserData));
      
      setIsEditing(false);
      onProfileUpdated(updatedUserData);
      Alert.alert(t.profileUpdated);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSave = () => {
    if (editedPhone !== userData.signupData?.phoneNumber) {
      handlePhoneChange();
    } else {
      saveProfile();
    }
  };

  if (isPhoneVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsPhoneVerification(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← {t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t.verifyPhone}</Text>
        </View>
        
        <View style={styles.otpContainer}>
          <Text style={styles.otpTitle}>{t.enterOtp}</Text>
          <Text style={styles.otpSubtitle}>OTP sent to {editedPhone}</Text>
          
          <TextInput
            style={styles.otpInput}
            value={otpCode}
            onChangeText={setOtpCode}
            placeholder="Enter 6-digit OTP"
            keyboardType="numeric"
            maxLength={6}
          />
          
          <TouchableOpacity style={styles.verifyButton} onPress={verifyOTP}>
            <Text style={styles.verifyButtonText}>{t.verify}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resendButton} onPress={sendOTP}>
            <Text style={styles.resendButtonText}>{t.resendOtp}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← {t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
            <Text style={styles.editButtonText}>{isEditing ? t.done : t.edit}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {editedPhoto ? (
              <Image source={{ uri: editedPhoto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>📷</Text>
              </View>
            )}
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton} onPress={handlePhotoChange}>
              <Text style={styles.changePhotoText}>{t.changePhoto}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.personalInfo}</Text>
          
          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t.fullName}</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder={t.fullName}
              />
            ) : (
              <Text style={styles.fieldValue}>{userData.signupData?.fullName || 'Not set'}</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t.phoneNumber}</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={editedPhone}
                onChangeText={setEditedPhone}
                placeholder={t.phoneNumber}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{userData.signupData?.phoneNumber || 'Not set'}</Text>
            )}
          </View>

          {/* City */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t.city}</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={editedCity}
                onChangeText={setEditedCity}
                placeholder={t.city}
              />
            ) : (
              <Text style={styles.fieldValue}>{userData.signupData?.city || 'Not set'}</Text>
            )}
          </View>

          {/* Location */}
          {userData.location && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>📍 {t.location}</Text>
              <Text style={styles.fieldValue}>
                {userData.location.address || `${userData.location.latitude.toFixed(4)}, ${userData.location.longitude.toFixed(4)}`}
              </Text>
            </View>
          )}
        </View>

        {/* Save Button */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleEditToggle}>
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  photoSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  photoContainer: {
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#e1e5e9',
  },
  photoPlaceholderText: {
    fontSize: 40,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  changePhotoText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  fieldInput: {
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  otpContainer: {
    padding: 24,
    alignItems: 'center',
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  otpInput: {
    fontSize: 24,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 24,
    width: 200,
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resendButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 