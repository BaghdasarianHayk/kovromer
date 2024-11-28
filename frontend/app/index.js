import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  return (
    <ProtectedRoute>
      <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    </ProtectedRoute>
  );
}
