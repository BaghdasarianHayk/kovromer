import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Modal, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import ProtectedRoute from '../../components/ProtectedRoute';
import CheckBox from '../../components/CheckBox';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import MainButton from '../../components/MainButton';

export default function Cameras() {
  const [cameras, setCameras] = useState([])
  const { selectedCamera, setSelectedCamera, currentToken } = useAuth();
  const [addCameraModalVisible, setAddCameraModalVisible] = useState(false)
  const [newCameraTitle, setNewCameraTitle] = useState('')
  const vw = useWindowDimensions().width
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setAddCameraModalVisible(true)}>
          <Text style={{fontSize: 16, color: 'rgba(0,101,253,1)'}}>Добавить  </Text>
        </TouchableOpacity>
      ),
    })
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCameras();
  
      return () => {
      };
    }, [])
  );
  const fetchCameras = async () => {
    try {
      const response = await axios.get(
        'https://ковромер.рф/api/cameras/', 
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.data?.detail) {
        setCameras(response.data);
      }
    } catch (error) {
      alert('Error fetching cameras:', error);
    }
  };

  const calibration = () => {
    router.push({pathname: '/cameras/calibration/' + selectedCamera?.id, params: {title: selectedCamera?.title}});
  }

  const addCamera = async () => {
    if(newCameraTitle.length > 0){
      try {
        const response = await axios.post(
          'https://ковромер.рф/api/cameras/', 
          {
            title: newCameraTitle,
          }, 
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        if (response.status === 201 && response.data) {
          fetchCameras();
          setNewCameraTitle('');
          setAddCameraModalVisible(false)
          router.push({pathname: '/cameras/' + response.data.id, params: {title: response.data.title}});
        }
      } catch (error) {
        alert('Error adding camera:', error.response?.data?.detail || error.message);
      }
    }else{
      alert('Введите наименование новой камеры!')
    }
  }

  return (
    <ProtectedRoute>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{alignItems: 'center', gap: 10, paddingVertical: 10}} style={{flex: 1, width: '100%'}}>
          {cameras.map((camera, index) => (
            <CheckBox 
              key={index}
              text={camera.title}
              checked={camera.id == selectedCamera?.id}
              width="100%"
              onPress={() => setSelectedCamera(camera)}
            />
          ))
          }
          <Modal
            animationType="fade"
            transparent={true}
            visible={addCameraModalVisible}
            onRequestClose={() => {
              setAddCameraModalVisible(false);
            }}>
              <TouchableOpacity 
                activeOpacity={1}
                style={{backgroundColor: 'rgba(0,0,0,0.25)', flex: 1, alignItems: 'center', justifyContent: 'center'}}
              >
                <View style={{width: 340, paddingTop: 20, maxWidth: vw - 40, backgroundColor: 'white', borderRadius: 16, alignItems: 'center'}}>
                  <Text style={{width: 300, maxWidth: vw - 80, textAlign: 'center', fontSize: 18, fontWeight: '500'}} numberOfLines={1}>Новая камера</Text>
                  <Text style={{width: 300, maxWidth: vw - 80, textAlign: 'center', fontSize: 16, marginTop: 5}} numberOfLines={1}>Напишите наименование новой камеры</Text>
                  <TextInput 
                    onChangeText={setNewCameraTitle}
                    placeholder='Новая камера'
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    style={{width: 300, maxWidth: vw - 40, borderWidth: 1, outline: 0, padding: 8, marginTop: 20, borderRadius: 8, borderColor: '#D5D5D5'}}
                  />
                  <View style={{flexDirection: 'row', width: '100%', marginTop: 10, borderTopWidth: 1, borderTopColor: '#efefef'}}>
                    <TouchableOpacity onPress={() => setAddCameraModalVisible(false)} style={{width: '50%', paddingVertical: 12, borderRightWidth: 1, borderRightColor: '#efefef'}}>
                      <Text numberOfLines={1} style={{width: '100%', textAlign: 'center', color: 'rgba(0,101,253,1)'}}>Отмена</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={addCamera} style={{width: '50%', paddingVertical: 12}}>
                      <Text numberOfLines={1} style={{width: '100%', textAlign: 'center', color: 'rgba(0,101,253,1)', fontWeight: '500'}}>Добавить</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
          </Modal>
          </ScrollView>
          {selectedCamera?.id && <View style={{width: '100%', paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#efefef'}}>
            <MainButton onPress={calibration} text="Калибровать" type="standard" defaultWidth={320} />
          </View>}
        </SafeAreaView>
      </View>
    </ProtectedRoute>
  );
}
