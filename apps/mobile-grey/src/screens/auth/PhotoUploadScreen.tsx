import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PhotoUploadScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Photo Upload Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A192F',
  },
  text: {
    color: 'white',
  }
});

export default PhotoUploadScreen;

