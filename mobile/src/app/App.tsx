import React from 'react';
import { Text, View } from 'react-native';
import { createAppContext } from './bootstrap/createAppContext';

export function App() {
  React.useEffect(() => {
    void createAppContext({
      apiBaseUrl: 'http://localhost:5000',
      deviceId: 'device-id-placeholder',
    });
  }, []);

  return (
    <View>
      <Text>ExamForge mobile shell</Text>
    </View>
  );
}

