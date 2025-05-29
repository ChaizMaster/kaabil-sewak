# User Profile Feature Documentation

## Overview

The User Profile feature allows users to view and edit their personal information after completing the authentication flow. This includes updating their name, photo, mobile number, and city information.

## Features

### 1. Profile Viewing
- Display current user information including:
  - Full name
  - Phone number
  - City
  - Profile photo
  - Current location (if available)

### 2. Profile Editing
- **Name editing**: Direct text input with immediate save
- **City editing**: Direct text input with immediate save
- **Photo editing**: Camera or gallery selection with image picker
- **Phone number editing**: Requires OTP re-authentication for security

### 3. OTP Re-authentication for Phone Changes
When users attempt to change their phone number:
1. System displays warning about OTP requirement
2. User confirms they want to proceed
3. OTP is sent to the new phone number
4. User enters OTP (test values: `123456` or `1234`)
5. On successful verification, phone number is updated
6. Profile is saved to AsyncStorage

## Navigation Flow

```
JobsScreen → [Profile Button] → UserProfileScreen
                                      ↓
                              [Edit Mode Toggle]
                                      ↓
                              [Save Changes]
                                      ↓
                        [Phone Change Detection]
                                      ↓
                        [OTP Verification Screen]
                                      ↓
                           [Profile Updated]
                                      ↓
                              [Back to Jobs]
```

## Multi-language Support

The profile feature is fully localized for:
- **English**: Complete interface
- **Hindi**: हिंदी भाषा में पूर्ण इंटरफेस
- **Bengali**: বাংলা ভাষায় সম্পূর্ণ ইন্টারফেস

## Technical Implementation

### Components
- `UserProfileScreen.tsx`: Main profile management screen
- `JobsScreen.tsx`: Updated with profile button integration
- `NewAuthFlow.tsx`: Updated to handle profile navigation

### Data Storage
- User profile data is stored in AsyncStorage
- Real-time updates to user data state
- Persistent storage across app sessions

### Security Features
- Phone number changes require OTP verification
- No sensitive data exposure in UI
- Secure photo handling with expo-image-picker

## Usage Instructions

### For Users
1. **Access Profile**: Tap the profile icon (👤) in the top-right corner of the jobs screen
2. **Edit Information**: Tap the "Edit" button to enter edit mode
3. **Update Fields**: Modify name, city, or photo as needed
4. **Change Phone**: Enter new phone number and follow OTP verification
5. **Save Changes**: Tap "Save Changes" to persist updates
6. **Cancel**: Tap "Cancel" to discard changes

### For Developers
1. **Profile Integration**: The profile screen is integrated into the main auth flow
2. **State Management**: Uses React hooks for local state and AsyncStorage for persistence
3. **Error Handling**: Comprehensive error handling for photo uploads and OTP verification
4. **Type Safety**: Full TypeScript support with proper interfaces

## Testing

### Test Scenarios
1. **Profile Viewing**: Verify all user data displays correctly
2. **Name/City Editing**: Test direct field editing and saving
3. **Photo Upload**: Test both camera and gallery photo selection
4. **Phone Number Change**: Test OTP flow with test codes `123456` or `1234`
5. **Navigation**: Test back button and flow transitions
6. **Multi-language**: Test all translations work correctly

### Test OTP Codes
- `123456`: Standard 6-digit test code
- `1234`: Alternative 4-digit test code
- Any other code will show "Invalid OTP" error

## Future Enhancements

### Planned Features
1. **Email Address**: Add email field with verification
2. **Work Experience**: Add work history section
3. **Skills**: Add skill tags and verification
4. **Documents**: Add document upload (Aadhar, etc.)
5. **Ratings**: Display user ratings and reviews

### Technical Improvements
1. **Real Firebase Integration**: Replace mock OTP with actual Firebase
2. **Photo Compression**: Optimize image size for storage
3. **Offline Support**: Enable profile editing without internet
4. **Data Validation**: Enhanced field validation and error messages

## API Integration Points

### Current (Mock)
- OTP verification: Mock implementation with test codes
- Photo storage: Local device storage
- Data persistence: AsyncStorage

### Future (Production)
- OTP verification: Firebase Phone Authentication
- Photo storage: Firebase Storage or CloudFlare Images
- Data persistence: Firebase Firestore with real-time sync
- Profile sync: Cross-device profile synchronization

---

*This feature enhances user engagement by providing complete profile management capabilities while maintaining security through OTP verification for sensitive changes.* 