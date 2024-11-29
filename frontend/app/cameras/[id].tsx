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
  const frameInterval = useRef<NodeJS.Timeout | null>(null);
  const { currentToken } = useAuth();
  const { id } = useLocalSearchParams()

  const startStreaming = async () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {

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
    }
  };

  useEffect(() => {
    return () => {
      if (frameInterval.current) {
        clearInterval(frameInterval.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const stopStreaming = () => {
    if (ws.current) {
      ws.current.close();
    }
    setIsStreaming(false);

    if (frameInterval.current) {
      clearInterval(frameInterval.current); // Clear the interval
      frameInterval.current = null; // Reset the interval reference
    }
    router.replace('/cameras')
  };

  const captureAndSendFrames = async () => {
    if (cameraRef.current) {
      frameInterval.current = setInterval(async () => {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.4,
          exif: false,
          fastMode: true,
          scale: 0.4
        });

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(photo.base64);
        }
      }, 100);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <View style={{flex: 1, backgroundColor: 'white', width: '100%', height: '100%'}}>
        <SafeAreaView style={{flex: 1, width: '100%', height: '100%'}}>
            <CameraView style={{flex: 1}} facing={facing}>
              <View style={{position: 'absolute', bottom: 20, alignItems: 'center', width: '100%'}}>
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