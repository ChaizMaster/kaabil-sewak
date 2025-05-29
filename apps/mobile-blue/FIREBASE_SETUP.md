# 🔥 Firebase Authentication Setup Guide

## 📋 Prerequisites

1. **Firebase Account**: Create a free Firebase account at [https://firebase.google.com/](https://firebase.google.com/)
2. **Phone Number**: Have your Indian mobile number ready for testing (+91 format)

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `kaabil-sewak-auth` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## 📱 Step 2: Add Web App to Firebase Project

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Enter app nickname: `kaabil-sewak-mobile`
3. **Do NOT** check "Set up Firebase Hosting"
4. Click **"Register app"**
5. **Copy the Firebase configuration object** - you'll need this!

```javascript
// Your Firebase config will look like this:
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🔐 Step 3: Enable Phone Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Click **Enable**
4. Add your phone number to **Test phone numbers** (for testing):
   - Phone number: `+91XXXXXXXXXX` (your actual number)
   - Verification code: `123456` (you can use any 6-digit code for testing)
5. Click **Save**

## ⚙️ Step 4: Configure Your App

1. Open `apps/mobile-blue/src/config/firebase.config.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 🧪 Step 5: Testing Setup

### Option A: Test Phone Numbers (Recommended for Development)

1. Use the test phone number you added in Step 3
2. When prompted for OTP, enter `123456` (or whatever code you set)
3. This won't send real SMS but will work for testing

### Option B: Real Phone Numbers

1. Use your actual phone number
2. Firebase will send real SMS with OTP
3. **Note**: Firebase has daily SMS limits on free tier

## 🚀 Step 6: Run the App

```bash
cd apps/mobile-blue
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Or scan QR code with Expo Go app

## 📱 Manual Testing Flow

1. **Login Screen**:
   - Enter your phone number (Indian format: 9876543210)
   - Click "Send OTP"

2. **OTP Screen**:
   - Enter the 6-digit code
   - For test numbers: use `123456`
   - For real numbers: check your SMS

3. **Success Screen**:
   - See your Firebase UID
   - Test "Continue to App" and "Sign Out"

## 🔍 Debugging

### Check Console Logs
- Open browser dev tools or React Native debugger
- Look for Firebase-related logs
- Firebase UID will be logged on successful authentication

### Common Issues

1. **"Firebase: Error (auth/invalid-app-credential)"**
   - Check your Firebase config values
   - Ensure project is properly set up

2. **"Firebase: Error (auth/too-many-requests)"**
   - You've exceeded SMS limits
   - Use test phone numbers instead

3. **"Firebase: Error (auth/invalid-phone-number)"**
   - Ensure phone number is in +91XXXXXXXXXX format
   - Check that it's a valid Indian mobile number

4. **reCAPTCHA Issues**
   - This is normal in development
   - reCAPTCHA is handled automatically

## 🎯 Production Considerations

1. **Remove Test Phone Numbers**: Before production, remove test numbers from Firebase
2. **SMS Costs**: Real SMS will incur costs after free tier limits
3. **Security Rules**: Set up proper Firestore security rules
4. **App Verification**: Configure SHA certificates for Android

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify your configuration matches exactly
3. Test with both test and real phone numbers
4. Check network connectivity

---

**🎉 You're ready to test Firebase Phone Authentication!**

The app will now:
- ✅ Send OTP to your phone
- ✅ Verify the code
- ✅ Store session securely
- ✅ Handle sign out
- ✅ Auto-login returning users 