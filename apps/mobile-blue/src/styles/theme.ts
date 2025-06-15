import { DefaultTheme, Theme } from '@react-navigation/native';

export const colors = {
  background: '#0A192F',      // Very dark blue
  card: 'rgba(23, 42, 70, 0.65)', // Semi-transparent deep blue
  text: '#F0F4F8',            // Off-white
  textSecondary: '#A0AEC0',     // Muted light gray
  primary: '#4A90E2',         // Bright blue for actions
  buttonText: '#FFFFFF',      // White text on primary buttons
  disabled: '#5D636D',         // Muted gray for disabled
  border: 'rgba(240, 244, 248, 0.25)', // Semi-transparent light gray
  inputBorder: '#3A4C63',    // Specific border for inputs like OTP
  error: '#D32F2F',            // Standard error red
  lightGray: '#2C2C2C',       // Fallback for lighter elements if needed
  otpFocus: '#F055A8',         // Pink for OTP focus
  gold: '#F0B90B',            // Gold/Yellow for accents
};

export const AppTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
  },
};

// Legacy export for components that use it directly
export const theme = {
  colors,
}; 