import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, ImageBackground, PanResponder, Image } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Svg, { Polygon } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import MainButton from '../components/MainButton';
import axios from 'axios';

export default function FourthScreen() {
  const params = useLocalSearchParams();
  const serverImage = params.serverImage

  const { selectedCamera } = useAuth();
  const [serverImageDimensions, setServerImageDimensions] = useState({ width: 0, height: 0 });
  const [safeAreaDimensions, setSafeAreaDimensions] = useState({ width: 0, height: 0 });
  const [dotPositions, setDotPositions] = useState([
    { x: 0.2, y: 0.2 },
    { x: 0.8, y: 0.2 },
    { x: 0.8, y: 0.8 },
    { x: 0.2, y: 0.8 },
  ]);

  const imageRef = useRef(null);
  const SafeAreaViewRef = useRef(null);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        Image.getSize(
          serverImage,
          (width, height) => {
            setServerImageDimensions({ width, height });
          },
          (error) => {
            alert('Error fetching image dimensions:', error.toString());
          }
        );

        await detectCarpet(serverImage);  // Assuming serverImage is Base64 or a valid URL
      } catch (error) {
        console.error("Error in fetching image data:", error);
      }
    };

    fetchImageData();  // Call the async function inside useEffect
  }, [serverImage]);

  async function detectCarpet(base64Image) {
    try {
      const response = await axios.post('https://ковромер.рф/api/cameras/detect_carpet', {
        base64_image: base64Image
      });
      console.log(response.data);  // Handle the response from the API
      if(response.data){
        setDotPositions(response.data)
      }
    } catch (error) {
      console.error("Error detecting carpet:", error);
    }
  }

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

  const calculateDistance = (dot1, dot2) => {
    return Math.sqrt(Math.pow(dot2.x - dot1.x, 2) + Math.pow(dot2.y - dot1.y, 2));
  };

  function sizeRound(num) {
    const lastDigit = num % 10;
    if (lastDigit >= 5) {
      return Math.ceil(num / 10) * 10;
    } else {
      return Math.floor(num / 10) * 10;
    }
  }

  const to_fifth_step = () => {
    const realDotPositions = dotPositions.map((dot) => ({
      x: dot.x * serverImageDimensions.width,
      y: dot.y * serverImageDimensions.height,
    }));

    const width1 = calculateDistance(realDotPositions[0], realDotPositions[1]);
    const width2 = calculateDistance(realDotPositions[2], realDotPositions[3]);
    const length1 = calculateDistance(realDotPositions[0], realDotPositions[3]);
    const length2 = calculateDistance(realDotPositions[1], realDotPositions[2]);

    const mainWidth = ((width1 + width2) / 2)/Math.sqrt(selectedCamera?.ratio);
    const mainLength = ((length1 + length2) / 2)/Math.sqrt(selectedCamera?.ratio);

    router.push({pathname: 'fifth_step', params: {dotPositions: JSON.stringify(realDotPositions), width: sizeRound(mainWidth), length: sizeRound(mainLength), ...params}})
  }

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
                  backgroundColor: index == 0 ? 'red' : index == 1 ? 'green' : index == 2 ? 'blue' : 'yellow',
                  left: dot.x * (containStyle.width || 1) - 10,
                  top: dot.y * (containStyle.height || 1) - 10,
                }}
              />
            </PanGestureHandler>
          ))}
        </ImageBackground>
        <View style={{ position: 'absolute', alignItems: 'center', bottom: 20, width: '100%' }}>
          <MainButton text="Далее" onPress={to_fifth_step} type="standard" defaultWidth={320} />
        </View>
      </SafeAreaView>
    </View>
  );
}
