import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    background: '#0A192F',
    surface: '#1A2942',
    primary: '#3B82F6',
    secondary: '#A0AEC0',
    text: '#F0F4F8',
    textSecondary: '#A0AEC0',
    border: '#2D3748',
    success: '#34D399',
    error: '#E53E3E',
    white: '#FFFFFF',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as 'bold',
      color: '#F0F4F8',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as 'bold',
      color: '#F0F4F8',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as '600',
      color: '#F0F4F8',
    },
    body: {
      fontSize: 16,
      color: '#A0AEC0',
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as '600',
      color: '#A0AEC0',
    },
    button: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      color: '#FFFFFF',
    },
  },
};

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
  },
  scrollContainer: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
  },
  title: {
    ...theme.typography.h1,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  subtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
    color: theme.colors.textSecondary,
  },
}); 