import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Text, View, SafeAreaView } from 'react-native';
import MainButton from '../../components/MainButton';
import { useAuth } from '../../context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Cameras() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isStreaming, setIsStreaming] = useState(false);
  const cameraRef = useRef(null);
  const ws = useRef(null);
  const frameInterval = useRef(null);
  const { currentToken } = useAuth();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    requestPermission();

    return () => {
      clearInterval(frameInterval.current);
      ws.current?.close();
    };
  }, []);

  if (!permission || !permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const startStreaming = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(`wss://ковромер.рф/api/cameras/${id}/ws?token=${encodeURIComponent(currentToken)}`);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsStreaming(true);
      captureAndSendFrames();
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
      setIsStreaming(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [currentToken, id]);

  const stopStreaming = useCallback(() => {
    ws.current?.close();
    setIsStreaming(false);
    clearInterval(frameInterval.current);
    frameInterval.current = null;
    router.replace('cameras');
  }, []);

  const captureAndSendFrames = useCallback(() => {
    if (cameraRef.current) {
      frameInterval.current = setInterval(async () => {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true,
            quality: 0.4,
            fastMode: true,
          });

          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(photo.base64);
          }
        } catch (error) {
          console.error('Capture error:', error);
        }
      }, 100);
    }
  }, []);

  return (
    <ProtectedRoute>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <CameraView style={{ flex: 1 }} ref={cameraRef} mirror={false} />
          <View style={{ position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' }}>
            <MainButton
              defaultWidth={320}
              type={isStreaming ? 'danger' : 'standard'}
              text={isStreaming ? 'Прекратить трансляцию' : 'Начать трансляцию'}
              onPress={isStreaming ? stopStreaming : startStreaming}
            />
          </View>
        </SafeAreaView>
      </View>
    </ProtectedRoute>
  );
}
