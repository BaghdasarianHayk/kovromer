import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, SafeAreaView, ImageBackground, Text } from 'react-native';
import { router } from 'expo-router';
import MainButton from '../components/MainButton';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ThirdStep() {
  const [serverImage, setServerImage] = useState('https://media.istockphoto.com/id/1222249647/photo/creative-illustration.jpg?s=612x612&w=0&k=20&c=N6foEeJRoGSTl1LcN1RJ1aP_G3FhZ8aWku30iwtmT4A=');
  const ws = useRef(null);
  const { currentToken, selectedCamera } = useAuth();

  const startFetching = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      ws.current = new WebSocket(`wss://ковромер.рф/api/cameras/${selectedCamera.id}/ws?token=${encodeURIComponent(currentToken)}`); // Use server IP

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

  useEffect(() => {
    if (selectedCamera?.id) {
      startFetching();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      setServerImage('https://media.istockphoto.com/id/1222249647/photo/creative-illustration.jpg?s=612x612&w=0&k=20&c=N6foEeJRoGSTl1LcN1RJ1aP_G3FhZ8aWku30iwtmT4A=');
    };
  }, [selectedCamera]);
  

  return (
    <ProtectedRoute>
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        {selectedCamera?.id ? (
          <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
            <ImageBackground style={{ flex: 1 }} resizeMode="contain" source={{ uri: serverImage }}>
              <View style={{ position: 'absolute', alignItems: 'center', bottom: 20, width: '100%' }}>
                <MainButton
                  defaultWidth={320}
                  type="standard"
                  text="Сделать фото"
                  onPress={() => router.push({ pathname: '/fourth_screen', params: { serverImage } })}
                />
              </View>
            </ImageBackground>
          </SafeAreaView>
        ) : (
          <>
            <Text>Выберите камеру чтобы продолжить!</Text>
            <View style={{ position: 'absolute', alignItems: 'center', bottom: 20, width: '100%' }}>
              <MainButton
                defaultWidth={320}
                type="standard"
                text="Выбрать камеру"
                onPress={() => router.push({ pathname: '/cameras', params: { serverImage } })}
              />
            </View>
          </>
        )}
      </View>
    </ProtectedRoute>
  );
}