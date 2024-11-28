import React, { useState, useRef } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { View, SafeAreaView, ImageBackground, useWindowDimensions } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import MainButton from '../../../components/MainButton';
import { useAuth } from '../../../context/AuthContext';

export default function FirstStep() {
  const vw = useWindowDimensions().width
  const [serverImage, setServerImage] = useState('https://media.istockphoto.com/id/1222249647/photo/creative-illustration.jpg?s=612x612&w=0&k=20&c=N6foEeJRoGSTl1LcN1RJ1aP_G3FhZ8aWku30iwtmT4A=');
  const ws = useRef()
  const {currentToken, selectedCamera} = useAuth()
  const { id, title } = useLocalSearchParams()

  useFocusEffect(() => {
    startFetching()
  })

  const startFetching = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      ws.current = new WebSocket(`wss://89.111.169.221:8000/cameras/${selectedCamera.id}/ws?token=${encodeURIComponent(currentToken)}`); // Use server IP

      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        setServerImage(event.data);
      };

      ws.current.onclose = () => {
        console.log('WebSocket closed');
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  }

  return (
    <ProtectedRoute>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ImageBackground
            style={{ flex: 1 }}
            resizeMode="contain"
            source={{ uri: serverImage }}
          >
            <View style={{ position: 'absolute', alignItems: 'center', bottom: 20, width: vw }}>
              <MainButton defaultWidth={320} type="standard" text="Сделать фото" onPress={() => router.push({pathname: `/cameras/calibration/${id}/calibrate`, params: {serverImage: serverImage}})} />
            </View>
          </ImageBackground>
        </SafeAreaView>
      </View>
    </ProtectedRoute>
  );
}
