import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { JobDiscoveryScreen } from './src/screens/JobDiscoveryScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <JobDiscoveryScreen />
    </>
  );
}
