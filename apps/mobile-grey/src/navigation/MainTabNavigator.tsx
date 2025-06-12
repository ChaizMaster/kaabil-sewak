import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

import DashboardScreen from '../screens/main/DashboardScreen';
import PostJobScreen from '../screens/main/PostJobScreen';
import MyJobsScreen from '../screens/main/MyJobsScreen';
import WorkerVerificationScreen from '../screens/main/WorkerVerificationScreen';
import DigitalMusterRollScreen from '../screens/main/DigitalMusterRollScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const translations = {
  english: {
    dashboard: 'Dashboard',
    postJob: 'Post Job',
    myJobs: 'My Jobs',
    verification: 'Verify Workers',
    musterRoll: 'Attendance',
    profile: 'Profile',
  },
  hindi: {
    dashboard: 'डैशबोर्ड',
    postJob: 'नौकरी पोस्ट करें',
    myJobs: 'मेरी नौकरियां',
    verification: 'कर्मचारी सत्यापन',
    musterRoll: 'हाजिरी',
    profile: 'प्रोफ़ाइल',
  },
  bengali: {
    dashboard: 'ড্যাশবোর্ড',
    postJob: 'কাজ পোস্ট করুন',
    myJobs: 'আমার কাজ',
    verification: 'কর্মী যাচাই',
    musterRoll: 'উপস্থিতি',
    profile: 'প্রোফাইল',
  },
};

const MainTabNavigator = ({ route }: { route: any }) => {
  const { name, businessName, mobileNumber, photoUri, city } = route.params || {};
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof MaterialIcons>['name'];

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'PostJob') {
            iconName = 'add-circle';
          } else if (route.name === 'MyJobs') {
            iconName = 'work';
          } else if (route.name === 'Verification') {
            iconName = 'verified-user';
          } else if (route.name === 'MusterRoll') {
            iconName = 'how-to-reg';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else {
            iconName = 'help-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          backgroundColor: '#1A2942',
          borderTopColor: '#2D3748',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        sceneContainerStyle: {
          backgroundColor: '#0A192F',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: t.dashboard }}
      />
      <Tab.Screen
        name="PostJob"
        component={PostJobScreen}
        options={{ title: t.postJob }}
      />
      <Tab.Screen
        name="MyJobs"
        component={MyJobsScreen}
        options={{ title: t.myJobs }}
      />
      <Tab.Screen
        name="Verification"
        component={WorkerVerificationScreen}
        options={{ title: t.verification }}
      />
      <Tab.Screen
        name="MusterRoll"
        component={DigitalMusterRollScreen}
        options={{ title: t.musterRoll }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ name, businessName, phoneNumber: mobileNumber, photoUri, city }}
        options={{ title: t.profile }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 