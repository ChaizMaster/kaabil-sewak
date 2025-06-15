import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Assuming colors are defined in a way that can be used by StyleSheet
import { colors } from './colors';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export const Button = ({ children, variant = 'primary', onPress, style }: ButtonProps) => {
  const variantStyle = styles[variant];
  const variantTextStyle = styles[`${variant}Text`];

  const content =
    typeof children === 'string' ? <Text style={[styles.text, variantTextStyle]}>{children}</Text> : children;

  return (
    <TouchableOpacity style={[styles.base, variantStyle, style]} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  secondaryText: {
    color: colors.black,
  },
}); 