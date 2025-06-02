import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import authService from '../../services/authService';

interface SuccessScreenProps {
  onContinue: () => void;
  onSignOut: () => void;
  language: 'english' | 'hindi' | 'bengali';
}

const translations = {
  english: {
    title: "Success!",
    subtitle: "Authentication Successful!",
    welcome: "Welcome to Kaabil Sewak",
    phoneNumber: "Phone Number",
    userId: "User ID",
    lastLogin: "Last Login",
    continue: "Continue to App",
    signOut: "Sign Out",
    signOutConfirmTitle: "Sign Out",
    signOutConfirmMessage: "Are you sure you want to sign out?",
    cancel: "Cancel",
    signedOutToast: "Signed Out",
    signedOutToastMsg: "You have been signed out successfully",
    signOutFailedToast: "Sign Out Failed",
    signOutFailedToastMsg: "Please try again",
    debugTitle: "🔍 Debug Information",
    debugFirebaseAuth: "Firebase Auth: Connected ✅",
    debugSession: "Session: Stored securely ✅",
    debugTesting: "Ready for manual testing! 🚀"
  },
  hindi: {
    title: "सफल!",
    subtitle: "प्रमाणीकरण सफल!",
    welcome: "काबिल सेवक में आपका स्वागत है",
    phoneNumber: "मोबाइल नंबर",
    userId: "उपयोगकर्ता आईडी",
    lastLogin: "पिछला लॉगिन",
    continue: "ऐप पर जारी रखें",
    signOut: "साइन आउट करें",
    signOutConfirmTitle: "साइन आउट करें",
    signOutConfirmMessage: "क्या आप निश्चित रूप से साइन आउट करना चाहते हैं?",
    cancel: "रद्द करें",
    signedOutToast: "साइन आउट किया गया",
    signedOutToastMsg: "आप सफलतापूर्वक साइन आउट हो गए हैं",
    signOutFailedToast: "साइन आउट विफल",
    signOutFailedToastMsg: "कृपया पुनः प्रयास करें",
    debugTitle: "🔍 डिबग जानकारी",
    debugFirebaseAuth: "फायरबेस प्रमाणीकरण: जुड़ा हुआ ✅",
    debugSession: "सत्र: सुरक्षित रूप से संग्रहीत ✅",
    debugTesting: "मैन्युअल परीक्षण के लिए तैयार! 🚀"
  },
  bengali: {
    title: "সাফল্য!",
    subtitle: "প্রমাণীকরণ সফল!",
    welcome: "কাবিল সেবকে স্বাগতম",
    phoneNumber: "ফোন নম্বর",
    userId: "ব্যবহারকারী আইডি",
    lastLogin: "শেষ লগইন",
    continue: "অ্যাপে চালিয়ে যান",
    signOut: "সাইন আউট করুন",
    signOutConfirmTitle: "সাইন আউট করুন",
    signOutConfirmMessage: "আপনি কি নিশ্চিত যে আপনি সাইন আউট করতে চান?",
    cancel: "বাতিল করুন",
    signedOutToast: "সাইন আউট করা হয়েছে",
    signedOutToastMsg: "আপনি সফলভাবে সাইন আউট হয়েছেন",
    signOutFailedToast: "সাইন আউট ব্যর্থ হয়েছে",
    signOutFailedToastMsg: "অনুগ্রহ করে আবার চেষ্টা করুন",
    debugTitle: "🔍 ডিবাগ তথ্য",
    debugFirebaseAuth: "ফায়ারবেস প্রমাণীকরণ: সংযুক্ত ✅",
    debugSession: "সেশন: নিরাপদে সংরক্ষিত ✅",
    debugTesting: "ম্যানুয়াল পরীক্ষার জন্য প্রস্তুত! 🚀"
  }
};

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onContinue,
  onSignOut,
  language,
}) => {
  const [userData, setUserData] = useState<any>(null);
  const t = translations[language];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const session = await authService.getUserSession();
      setUserData(session.userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t.signOutConfirmTitle,
      t.signOutConfirmMessage,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.signOut,
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
              Toast.show({
                type: 'success',
                text1: t.signedOutToast,
                text2: t.signedOutToastMsg,
              });
              onSignOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Toast.show({
                type: 'error',
                text1: t.signOutFailedToast,
                text2: t.signOutFailedToastMsg,
              });
            }
          },
        },
      ]
    );
  };

  const welcomeMessage = userData?.displayName ? `${t.welcome}, ${userData.displayName}!` : t.welcome;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.successIcon}>🎉</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitleEng}>{welcomeMessage}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t.continue}</Text>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#F0F4F8" style={styles.buttonArrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutButtonText}>{t.signOut}</Text>
          </TouchableOpacity>
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
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  mainContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  successIcon: {
    fontSize: 90,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#F055A8',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleEng: {
    fontSize: 20,
    fontWeight: '500',
    color: '#F0F4F8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  actionsContainer: {
    paddingBottom: 10,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(48, 79, 254, 0.8)',
    borderRadius: 18,
    paddingVertical: 18,
    minHeight: 60,
    borderWidth: 1,
    borderColor: 'rgba(240, 244, 248, 0.35)',
    marginBottom: 20,
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonArrowIcon: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  signOutButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#A0AEC0',
    textDecorationLine: 'underline',
  },
}); 