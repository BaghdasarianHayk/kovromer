import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, Text, View, SafeAreaView } from 'react-native';
import MainButton from '../../components/MainButton';
import { useAuth } from '../../context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Cameras() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isStreaming, setIsStreaming] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const frameInProgress = useRef(false);
  const { currentToken } = useAuth();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    return () => {
      // Cleanup WebSocket and interval on unmount
      if (ws.current) ws.current.close();
      setIsStreaming(false);
    };
  }, []);

  const startStreaming = async () => {
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
      stopStreaming(); // Ensure cleanup on error
    };
  };

  const stopStreaming = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setIsStreaming(false);
    router.replace('/cameras');
  };

  const captureAndSendFrames = async () => {
    if (cameraRef.current && !frameInProgress.current) {
      frameInProgress.current = true;

      const captureFrame = async () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          try {
            const photo = await cameraRef.current.takePictureAsync({
              base64: true,
              quality: 0.4,
              exif: false,
              fastMode: true,
              scale: 0.4,
            });

            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
              ws.current.send(photo.base64);
            }
          } catch (error) {
            console.error('Error capturing frame:', error);
          }
        }
        frameInProgress.current = false;
      };

      captureFrame().then(() => {
        if (isStreaming) {
          setTimeout(captureAndSendFrames, 100); // Debounce next frame capture
        }
      });
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <View style={{ flex: 1, backgroundColor: 'white', width: '100%', height: '100%' }}>
        <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
            <View style={{ position: 'absolute', bottom: 20, alignItems: 'center', width: '100%' }}>
              {isStreaming ? (
                <MainButton defaultWidth={320} type="danger" text="Прекратить трансляцию" onPress={stopStreaming} />
              ) : (
                <MainButton defaultWidth={320} type="standard" text="Начать трансляцию" onPress={startStreaming} />
              )}
            </View>
          </CameraView>
        </SafeAreaView>
      </View>
    </ProtectedRoute>
  );
}
