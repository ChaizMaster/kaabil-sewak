import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../styles/theme';

interface OptionalUPIScreenProps {
  onUPISubmitted: (upiId?: string) => void;
}

const OptionalUPIScreen: React.FC<OptionalUPIScreenProps> = ({ onUPISubmitted }) => {
  const [upiId, setUpiId] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add UPI ID (Optional)</Text>
      <Text style={styles.description}>
        Kaabil Sewak does not charge any fees. Adding your UPI ID helps you get paid directly and track your earnings easily. This is for your benefit only.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="your-name@upi"
        value={upiId}
        onChangeText={setUpiId}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.textSecondary}
      />
      <TouchableOpacity style={styles.button} onPress={() => onUPISubmitted(upiId)}>
        <Text style={styles.buttonText}>Save and Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onUPISubmitted(undefined)}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.colors.text,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: theme.colors.text,
  },
  button: {
    width: '100%',
    backgroundColor: 'rgba(48, 79, 254, 0.8)',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipText: {
    marginTop: 20,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});

export default OptionalUPIScreen; 