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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

type ProfileStackParamList = {
  Profile: { name?: string; businessName?: string; phoneNumber?: string; photoUri?: string; city?: string };
};

type ProfileRouteProp = RouteProp<ProfileStackParamList, 'Profile'>;

const translations = {
  english: {
    title: 'My Profile',
    editProfile: 'Edit Profile',
    personalInfo: 'Personal Information',
    fullName: 'Name',
    businessName: 'Business Name',
    phoneNumber: 'Phone Number',
    city: 'City / Town',
    photo: 'Business Logo',
    changePhoto: 'Change Logo',
    save: 'Save Changes',
    cancel: 'Cancel',
    edit: 'Edit',
    done: 'Done',
    verifyPhone: 'Verify New Number',
    phoneChangeWarning: 'Changing phone number requires OTP verification.',
    otpSent: 'OTP Sent',
    enterOtp: 'Enter OTP to verify',
    verify: 'Verify & Save',
    resendOtp: 'Resend OTP',
    profileUpdated: 'Profile Updated',
    invalidOtp: 'Invalid OTP. Please try again.',
    notSet: 'Not set',
    takePhoto: 'Take New Photo',
    choosePhoto: 'Choose from Gallery',
  },
  hindi: {
    title: 'मेरी प्रोफ़ाइल',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    personalInfo: 'व्यक्तिगत जानकारी',
    fullName: 'नाम',
    businessName: 'व्यवसाय का नाम',
    phoneNumber: 'फोन नंबर',
    city: 'शहर / कस्बा',
    photo: 'बिजनेस लोगो',
    changePhoto: 'लोगो बदलें',
    save: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    done: 'हो गया',
    verifyPhone: 'नया नंबर सत्यापित करें',
    phoneChangeWarning: 'फोन नंबर बदलने के लिए OTP सत्यापन आवश्यक है।',
    otpSent: 'OTP भेजा गया',
    enterOtp: 'सत्यापित करने के लिए OTP दर्ज करें',
    verify: 'सत्यापित करें और सहेजें',
    resendOtp: 'OTP पुनः भेजें',
    profileUpdated: 'प्रोफ़ाइल अपडेट की गई',
    invalidOtp: 'अमान्य OTP। कृपया पुन प्रयास करें।',
    notSet: 'निर्धारित नहीं है',
    takePhoto: 'नई फोटो लें',
    choosePhoto: 'गैलरी से चुनें',
  },
  bengali: {
    title: 'আমার প্রোফাইল',
    editProfile: 'প্রোফাইল সম্পাদনা করুন',
    personalInfo: 'ব্যক্তিগত তথ্য',
    fullName: 'নাম',
    businessName: 'ব্যবসার নাম',
    phoneNumber: 'ফোন নম্বর',
    city: 'শহর',
    photo: 'ব্যবসার লোগো',
    changePhoto: 'লোগো পরিবর্তন করুন',
    save: 'পরিবর্তন সংরক্ষণ করুন',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    done: 'সম্পন্ন',
    verifyPhone: 'নতুন নম্বর যাচাই করুন',
    phoneChangeWarning: 'ফোন নম্বর পরিবর্তনের জন্য OTP যাচাইকরণ প্রয়োজন।',
    otpSent: 'OTP পাঠানো হয়েছে',
    enterOtp: 'যাচাই করতে OTP লিখুন',
    verify: 'যাচাই করুন এবং সংরক্ষণ করুন',
    resendOtp: 'OTP পুনরায় পাঠান',
    profileUpdated: 'প্রোফাইল আপডেট করা হয়েছে',
    invalidOtp: 'অবৈধ OTP। অনুগ্রহ করে আবার চেষ্টা করুন।',
    notSet: 'সেট করা নেই',
    takePhoto: 'নতুন ছবি তুলুন',
    choosePhoto: 'গ্যালারি থেকে নির্বাচন করুন',
  },
};

const ProfileScreen = () => {
  const { language } = useLanguage();
  const route = useRoute<ProfileRouteProp>();
  const t = translations[language];

  // Initial data from route, with fallbacks
  const initialData = {
    name: route.params?.name || 'User',
    businessName: route.params?.businessName || 'Business',
    phoneNumber: route.params?.phoneNumber || '',
    city: route.params?.city || '', // Now this will be populated from signup
    photoUri: route.params?.photoUri || null,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isPhoneVerification, setIsPhoneVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const [editedData, setEditedData] = useState(initialData);

  const handleInputChange = (field: keyof typeof editedData, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      // "Done" was pressed, but we use a dedicated save button
      // This button will now just exit edit mode without saving
      setIsEditing(false);
      setEditedData(initialData); // Reset changes
    }
  };

  const handleSave = () => {
    // If phone number was changed, trigger verification
    if (editedData.phoneNumber !== initialData.phoneNumber && editedData.phoneNumber !== '') {
      Alert.alert(t.phoneChangeWarning, '', [
        { text: t.cancel, style: 'cancel' },
        { text: t.verifyPhone, onPress: sendOTP },
      ]);
    } else {
      saveProfile(); // Otherwise, save directly
    }
  };

  const sendOTP = () => {
    // Mock OTP sending
    setIsPhoneVerification(true);
    Alert.alert(t.otpSent, `An OTP has been sent to ${editedData.phoneNumber}.`);
  };

  const verifyOTP = () => {
    if (otpCode === '123456') { // Mock verification
      setIsPhoneVerification(false);
      setOtpCode('');
      saveProfile();
    } else {
      Alert.alert(t.invalidOtp);
    }
  };


  const saveProfile = () => {
    // In a real app, you'd save this to your backend/storage
    console.log('Saving data:', editedData);
    // Here we'd update the "initialData" to reflect the saved state
    initialData.name = editedData.name;
    initialData.businessName = editedData.businessName;
    initialData.phoneNumber = editedData.phoneNumber;
    initialData.city = editedData.city;
    initialData.photoUri = editedData.photoUri;

    setIsEditing(false);
    Alert.alert(t.profileUpdated);
  };

  const handleCancel = () => {
    setEditedData(initialData);
    setIsEditing(false);
    setIsPhoneVerification(false);
    setOtpCode('');
  };

  const handlePhotoChange = async () => {
    Alert.alert(t.changePhoto, '', [
      { text: t.cancel, style: 'cancel' },
      { text: t.takePhoto, onPress: takePhoto },
      { text: t.choosePhoto, onPress: chooseFromGallery },
    ]);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) handleInputChange('photoUri', result.assets[0].uri);
  };

  const chooseFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) handleInputChange('photoUri', result.assets[0].uri);
  };

  const InfoRow = ({ label, value, field }: { label: string; value: string; field: keyof typeof editedData }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={(text) => handleInputChange(field, text)}
        editable={isEditing}
        placeholder={isEditing ? `Enter ${label}` : t.notSet}
        placeholderTextColor="#64748B"
      />
    </View>
  );

  if (isPhoneVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.otpContainer}>
            <Text style={styles.title}>{t.verifyPhone}</Text>
            <Text style={styles.otpPrompt}>{t.enterOtp} {editedData.phoneNumber}</Text>
            <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={6}
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="------"
                placeholderTextColor="#64748B"
            />
            <TouchableOpacity style={styles.saveButton} onPress={verifyOTP}>
                <Text style={styles.saveButtonText}>{t.verify}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsPhoneVerification(false)}>
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
            <Text style={styles.editButtonText}>
              {isEditing ? t.done : t.edit}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photoSection}>
          <TouchableOpacity onPress={isEditing ? handlePhotoChange : undefined}>
            {editedData.photoUri ? (
              <Image
                source={{ uri: editedData.photoUri }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <MaterialIcons name="person" size={48} color="#64748B" />
              </View>
            )}
             {isEditing && (
                <View style={styles.cameraIconContainer}>
                  <MaterialIcons name="camera-alt" size={24} color="#F0F4F8" />
                </View>
              )}
          </TouchableOpacity>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>{t.personalInfo}</Text>
          <InfoRow label={t.fullName} value={editedData.name} field="name" />
          <InfoRow label={t.businessName} value={editedData.businessName} field="businessName" />
          <InfoRow label={t.phoneNumber} value={editedData.phoneNumber} field="phoneNumber" />
          <InfoRow label={t.city} value={editedData.city} field="city" />
        </View>

        {isEditing && (
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{t.save}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>{t.cancel}</Text>
                </TouchableOpacity>
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Keeping the dark theme palette
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A192F' },
  contentContainer: { paddingVertical: 20, paddingHorizontal: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F0F4F8' },
  editButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#2563EB', borderRadius: 8 },
  editButtonText: { color: '#F0F4F8', fontSize: 16, fontWeight: '600' },
  photoSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1A2942', borderWidth: 2, borderColor: '#2D3748'},
  avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  cameraIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
  detailsSection: { backgroundColor: '#1A2942', borderRadius: 12, overflow: 'hidden' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#F0F4F8', padding: 16, backgroundColor: '#2D374850' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#2D3748' },
  infoLabel: { fontSize: 16, color: '#A0AEC0' },
  infoInput: { fontSize: 16, color: '#F0F4F8', textAlign: 'right', flex: 1, marginLeft: 16 },
  actionsContainer: { marginTop: 32 },
  saveButton: { backgroundColor: '#2563EB', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  saveButtonText: { color: '#F0F4F8', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#4A5568', padding: 16, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: '#F0F4F8', fontSize: 16, fontWeight: 'bold' },
  otpContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  otpPrompt: { fontSize: 16, color: '#A0AEC0', textAlign: 'center', marginBottom: 20 },
  otpInput: { fontSize: 24, color: '#F0F4F8', backgroundColor: '#1A2942', borderWidth: 1, borderColor: '#2D3748', borderRadius: 8, width: '80%', padding: 16, textAlign: 'center', letterSpacing: 10, marginBottom: 20 },
});

export default ProfileScreen; 