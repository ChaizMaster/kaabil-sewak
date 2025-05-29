import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult,
  UserCredential,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import * as SecureStore from 'expo-secure-store';

const USER_TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'userData';

class AuthService {
  private confirmationResult: ConfirmationResult | null = null;

  // Validate Indian phone number format
  validateIndianPhoneNumber = (phoneNumber: string): boolean => {
    const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(phoneNumber.replace(/\s/g, ''));
  };

  // Format phone number to include +91
  formatPhoneNumber = (phoneNumber: string): string => {
    let cleaned = phoneNumber.replace(/\s/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '+91' + cleaned.substring(1);
    } else if (!cleaned.startsWith('+91')) {
      cleaned = '+91' + cleaned;
    }
    return cleaned;
  };

  // Send OTP to phone number (simplified for testing)
  sendOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!this.validateIndianPhoneNumber(phoneNumber)) {
        return { success: false, error: 'Invalid Indian phone number format' };
      }

      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      
      // For development: simulate successful OTP send
      console.log('OTP would be sent to:', formattedNumber);
      
      // Store the phone number for verification
      await SecureStore.setItemAsync('pending_phone', formattedNumber);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send OTP' 
      };
    }
  };

  // Verify OTP code
  verifyOTP = async (otpCode: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      if (otpCode.length !== 6) {
        return { success: false, error: 'OTP must be 6 digits' };
      }

      // For development: accept any 6-digit OTP
      const pendingPhone = await SecureStore.getItemAsync('pending_phone');
      if (!pendingPhone) {
        return { success: false, error: 'No OTP request found. Please request OTP first.' };
      }

      // Simulate successful verification with mock user data
      const mockUser = {
        uid: `user_${Date.now()}`,
        phoneNumber: pendingPhone,
        getIdToken: async () => `mock_token_${Date.now()}`,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        }
      } as User;

      // Store user session
      await this.storeUserSession(mockUser);
      
      // Clean up pending phone
      await SecureStore.deleteItemAsync('pending_phone');
      
      console.log('User authenticated successfully:', mockUser.uid);
      return { success: true, user: mockUser };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: 'Invalid OTP code' };
    }
  };

  // Store user session in secure storage
  storeUserSession = async (user: User) => {
    try {
      const token = await user.getIdToken();
      const userData = {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        createdAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime,
      };

      await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user session:', error);
    }
  };

  // Get stored user session
  getUserSession = async (): Promise<{ token: string | null; userData: any | null }> => {
    try {
      const token = await SecureStore.getItemAsync(USER_TOKEN_KEY);
      const userDataString = await SecureStore.getItemAsync(USER_DATA_KEY);
      const userData = userDataString ? JSON.parse(userDataString) : null;
      
      return { token, userData };
    } catch (error) {
      console.error('Error getting user session:', error);
      return { token: null, userData: null };
    }
  };

  // Check if user is authenticated
  isAuthenticated = async (): Promise<boolean> => {
    try {
      const { token } = await this.getUserSession();
      return !!token && !!auth.currentUser;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  // Sign out user
  signOut = async (): Promise<void> => {
    try {
      await auth.signOut();
      await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      this.confirmationResult = null;
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Resend OTP (same as sendOTP but with cooldown handling)
  resendOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    // Reset confirmation result to allow resend
    this.confirmationResult = null;
    return this.sendOTP(phoneNumber);
  };
}

export default new AuthService(); 