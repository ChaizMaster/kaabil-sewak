import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Placeholder = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is a placeholder component.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  text: {
    color: '#333',
  },
}); 