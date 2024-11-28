import { useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, ImageBackground, PanResponder, Image } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Svg, { Polygon } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import MainButton from '../components/MainButton';

export default function Cameras() {
  const { serverImage } = useLocalSearchParams();
  const { selectedCamera } = useAuth();
  const [serverImageDimensions, setServerImageDimensions] = useState({ width: 0, height: 0 });
  const [safeAreaDimensions, setSafeAreaDimensions] = useState({ width: 0, height: 0 });
  const [dotPositions, setDotPositions] = useState([
    { x: 0.2, y: 0.2 },
    { x: 0.2, y: 0.8 },
    { x: 0.8, y: 0.8 },
    { x: 0.8, y: 0.2 },
  ]);

  const imageRef = useRef(null);
  const SafeAreaViewRef = useRef(null);

  useEffect(() => {
    Image.getSize(
      serverImage,
      (width, height) => {
        setServerImageDimensions({ width, height });
      },
      (error) => {
        alert('Error fetching image dimensions:', error.toString());
      }
    );
  }, [serverImage]);

  getObjectArea = () => {
    if (
      serverImageDimensions.width > 0 &&
      serverImageDimensions.height > 0 &&
      dotPositions.length > 0
    ) {

      const realDotPositions = dotPositions.map((dot) => ({
        x: dot.x * serverImageDimensions.width,
        y: dot.y * serverImageDimensions.height,
      }));

      const area = calculateArea(realDotPositions);
      alert(`плошадь: ${Math.round(area/selectedCamera?.ratio/10000)} m²`);
    }
  };

  const onLayout = () => {
    SafeAreaViewRef.current.measure((x, y, width, height) => {
      setSafeAreaDimensions({ width, height });
    });
  };

  const getContainStyle = () => {
    const { width: safeWidth, height: safeHeight } = safeAreaDimensions;
    const { width: imgWidth, height: imgHeight } = serverImageDimensions;

    if (!safeWidth || !safeHeight || !imgWidth || !imgHeight) {
      return { width: 0, height: 0 };
    }

    const safeAspect = safeWidth / safeHeight;
    const imgAspect = imgWidth / imgHeight;

    if (safeAspect < imgAspect) {
      return {
        width: safeWidth,
        height: safeWidth / imgAspect,
      };
    } else {
      return {
        width: safeHeight * imgAspect,
        height: safeHeight,
      };
    }
  };

  const containStyle = getContainStyle();

  const createPanResponder = (index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newDotPositions = [...dotPositions];
        const imageWidth = containStyle.width || 1;
        const imageHeight = containStyle.height || 1;

        newDotPositions[index] = {
          x: newDotPositions[index].x + gestureState.dx / imageWidth,
          y: newDotPositions[index].y + gestureState.dy / imageHeight,
        };

        newDotPositions[index].x = Math.min(1, Math.max(0, newDotPositions[index].x));
        newDotPositions[index].y = Math.min(1, Math.max(0, newDotPositions[index].y));

        setDotPositions(newDotPositions);
      },
    });

  const calculateArea = (points) => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    return area;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView ref={SafeAreaViewRef} onLayout={onLayout} style={{ flex: 1 }}>
        <ImageBackground
          ref={imageRef}
          style={[{ backgroundColor: 'red', alignSelf: 'center' }, containStyle]}
          source={{ uri: serverImage }}
        >
          <Svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <Polygon
              points={dotPositions
                .map(
                  (dot) =>
                    `${dot.x * (containStyle.width || 1)},${dot.y * (containStyle.height || 1)}`
                )
                .join(' ')}
              fill="rgba(0,101,253,0.3)"
              stroke="rgba(0,101,253,1)"
              strokeWidth={2}
            />
          </Svg>
          {dotPositions.map((dot, index) => (
            <PanGestureHandler>
              <View
              key={index}
              {...createPanResponder(index).panHandlers}
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(0,101,253,1)',
                  left: dot.x * (containStyle.width || 1) - 10,
                  top: dot.y * (containStyle.height || 1) - 10,
                }}
              />
            </PanGestureHandler>
          ))}
        </ImageBackground>
        <View style={{ position: 'absolute', alignItems: 'center', bottom: 20, width: '100%' }}>
          <MainButton text="Далее" onPress={getObjectArea} type="standard" defaultWidth={320} />
        </View>
      </SafeAreaView>
    </View>
  );
}
