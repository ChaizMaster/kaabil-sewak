// A simplified, mocked version of the AuthService for mobile-grey
// to allow UI development without full backend functionality.

class AuthService {
  // Validate Indian phone number format
  validateIndianPhoneNumber = (phoneNumber: string): boolean => {
    const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(phoneNumber.replace(/\s/g, ''));
  };

  // Send OTP to phone number (mocked)
  sendOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    console.log(`Mock OTP sent to: ${phoneNumber}`);
    if (!this.validateIndianPhoneNumber(phoneNumber)) {
      return { success: false, error: 'Invalid Indian phone number format' };
    }
    // Simulate a successful OTP send
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  };

  // Verify OTP code (mocked)
  verifyOTP = async (otpCode: string): Promise<{ success: boolean; error?: string }> => {
    console.log(`Mock verifying OTP: ${otpCode}`);
    if (otpCode.length !== 6) {
        return { success: false, error: 'OTP must be 6 digits' };
    }
    // Simulate a successful verification
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  };
}

export default new AuthService(); 