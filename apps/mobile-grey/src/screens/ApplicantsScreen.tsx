import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ApplicantsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Applicants Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApplicantsScreen;

