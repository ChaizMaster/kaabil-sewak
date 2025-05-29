# 🧪 OTP Authentication Testing Guide

## 🚀 Quick Start Testing

### 1. Setup Firebase (5 minutes)
1. Follow `FIREBASE_SETUP.md` to configure Firebase
2. Add your phone number as a test number with OTP `123456`
3. Update `firebase.config.ts` with your project credentials

### 2. Run the App
```bash
cd apps/mobile-blue
npm start
# Press 'a' for Android or 'i' for iOS
```

## 📱 Test Scenarios

### ✅ Scenario 1: First Time Login
1. **Enter Phone Number**: `9876543210` (or your test number)
2. **Click**: "Send OTP"
3. **Expected**: Success toast + navigate to OTP screen
4. **Enter OTP**: `123456` (for test numbers)
5. **Expected**: Success screen with Firebase UID logged

### ✅ Scenario 2: Invalid Phone Number
1. **Enter**: `123` (invalid number)
2. **Click**: "Send OTP"
3. **Expected**: Error toast "Invalid Indian phone number format"

### ✅ Scenario 3: Wrong OTP
1. **Complete**: Phone number entry
2. **Enter OTP**: `000000` (wrong code)
3. **Expected**: Error toast + OTP inputs cleared

### ✅ Scenario 4: Resend OTP
1. **Complete**: Phone number entry
2. **Wait**: 30 seconds for resend timer
3. **Click**: "Resend OTP"
4. **Expected**: New OTP sent + timer reset

### ✅ Scenario 5: Auto-Login
1. **Complete**: Full authentication once
2. **Close**: App completely
3. **Reopen**: App
4. **Expected**: Skip login, go directly to success screen

### ✅ Scenario 6: Sign Out
1. **From**: Success screen
2. **Click**: "Sign Out"
3. **Confirm**: Sign out dialog
4. **Expected**: Return to login screen

## 🔍 What to Check

### Console Logs
- `OTP sent successfully to: +91XXXXXXXXXX`
- `User authenticated successfully: [Firebase UID]`
- `Firebase User UID: [UID]` (on success screen)

### UI Behavior
- ✅ Phone number formatting (98765 43210)
- ✅ Loading states during API calls
- ✅ Toast notifications for errors/success
- ✅ Auto-focus between OTP input fields
- ✅ Disabled buttons during loading
- ✅ 30-second resend cooldown timer

### Data Persistence
- ✅ User session stored securely
- ✅ Auto-login on app restart
- ✅ Session cleared on sign out

## 🐛 Common Issues & Solutions

### Issue: "Firebase: Error (auth/invalid-app-credential)"
**Solution**: Check your Firebase config in `firebase.config.ts`

### Issue: OTP not received
**Solution**: 
- Use test phone numbers for development
- Check Firebase Console → Authentication → Sign-in method → Phone

### Issue: "Too many requests"
**Solution**: Wait or use test phone numbers instead of real ones

### Issue: App crashes on OTP screen
**Solution**: Check that Firebase is properly initialized

## 📊 Success Criteria

Your authentication flow is working correctly if:

1. ✅ **Phone validation** works for Indian numbers
2. ✅ **OTP sending** shows success message
3. ✅ **OTP verification** authenticates user
4. ✅ **Firebase UID** is logged in console
5. ✅ **Session persistence** works across app restarts
6. ✅ **Sign out** clears session and returns to login
7. ✅ **Error handling** shows appropriate messages
8. ✅ **UI/UX** is smooth with proper loading states

## 🎯 Ready for Production

Once all tests pass, your OTP authentication is ready for:
- ✅ Integration with backend APIs
- ✅ User profile creation
- ✅ Role-based access (grey-collar vs blue-collar)
- ✅ Real phone number verification in production

---

**🎉 Happy Testing!** 

Your Firebase Phone Authentication is now fully functional and ready for manual testing with your own phone number. 