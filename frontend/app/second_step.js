import { SafeAreaView, Text, useWindowDimensions, View, ScrollView } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute";
import MainTextInput from "../components/MainTextInput";
import Svg, { Path } from "react-native-svg";
import { useState } from "react";
import CheckBox from "../components/CheckBox";
import MainButton from "../components/MainButton";
import { router } from "expo-router";

export default function SecondStep(){
  const [carpetNumber, setCarpetNumber] = useState('')
  const [selectedType, setSelectedType] = useState({})
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([])

  const types = [
    {name: 'Длинный'},
    {name: 'Короткий'},
    {name: 'Синтетика'}
  ]

  const additional_services = [
    {name: 'Дефактовка'},
    {name: 'Пятновыводка'},
    {name: 'Оверлок'}
  ]

  const vw = useWindowDimensions().width

  const to_third_step = () => {
    // if(orderNumber.length * customerFullName.length * customerPhoneNumber.length > 0) {
      router.push({
        pathname: '/third_step',
        params: {
          // orderNumber: orderNumber,
          // customerFullName: customerFullName,
          // customerPhoneNumber: customerPhoneNumber,
          // comment: comment
        }
      });
    // } else {
    //   alert('Заполните все обязательные поля!');
    // }
  };

  return(
    <ProtectedRoute>
      <View style={{flex: 1, backgroundColor: 'white', width: '100%', height: '100%'}}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white', width: '100%', height: '100%', alignItems: 'center'}}>
          <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center', paddingVertical: 10, gap: 10}}>
            <MainTextInput 
              value={carpetNumber}
              onChangeText={setCarpetNumber}
              label="Номер ковра"
              placeholder="Номера ковра"
              width={320}
              SvgIcon={() => (
                <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <Path fillRule="evenodd" clipRule="evenodd" d="M4.65485 3.82153C4.16669 4.30968 4.16669 5.09536 4.16669 6.66671V14.1667C4.16669 15.738 4.16669 16.5237 4.65485 17.0119C5.143 17.5 5.92867 17.5 7.50002 17.5H12.5C14.0714 17.5 14.857 17.5 15.3452 17.0119C15.8334 16.5237 15.8334 15.738 15.8334 14.1667V6.66671C15.8334 5.09536 15.8334 4.30968 15.3452 3.82153C14.857 3.33337 14.0714 3.33337 12.5 3.33337H7.50002C5.92867 3.33337 5.143 3.33337 4.65485 3.82153ZM7.50002 6.66671C7.03979 6.66671 6.66669 7.03981 6.66669 7.50004C6.66669 7.96027 7.03979 8.33337 7.50002 8.33337H12.5C12.9603 8.33337 13.3334 7.96027 13.3334 7.50004C13.3334 7.03981 12.9603 6.66671 12.5 6.66671H7.50002ZM7.50002 10C7.03979 10 6.66669 10.3731 6.66669 10.8334C6.66669 11.2936 7.03979 11.6667 7.50002 11.6667H12.5C12.9603 11.6667 13.3334 11.2936 13.3334 10.8334C13.3334 10.3731 12.9603 10 12.5 10H7.50002ZM7.50002 13.3334C7.03979 13.3334 6.66669 13.7065 6.66669 14.1667C6.66669 14.627 7.03979 15 7.50002 15H10.8334C11.2936 15 11.6667 14.627 11.6667 14.1667C11.6667 13.7065 11.2936 13.3334 10.8334 13.3334H7.50002Z" fill={carpetNumber.length > 0 ? "black" : "#D5D5D5"}/>
                </Svg>
              )}
            />

            <Text style={{maxWidth: vw - 40, width: 320, fontWeight: '500', opacity: 0.8, marginTop: 10, marginBottom: 6}}>Тип ворса</Text>
            {
              types.map((type, index) => (
                <CheckBox 
                  key={index}
                  text={type.name} 
                  checked={selectedType.name == type.name} 
                  onPress={() => setSelectedType(type)} 
                  width={320}
                />
              ))
            }

            <Text style={{maxWidth: vw - 40, width: 320, fontWeight: '500', opacity: 0.8, marginTop: 10, marginBottom: 6}}>Дополнительные услуги</Text>
            {
              additional_services.map((additional_service, index) => (
                <CheckBox
                  key={index}
                  text={additional_service.name}
                  checked={selectedAdditionalServices.some(
                    item => item.name === additional_service.name
                  )}
                  onPress={() => {
                    let updatedSelectedAdditionalServices = [...selectedAdditionalServices];
                    if (
                      updatedSelectedAdditionalServices.some(
                        item => item.name === additional_service.name
                      )
                    ) {
                      updatedSelectedAdditionalServices = updatedSelectedAdditionalServices.filter(
                        item => item.name !== additional_service.name
                      );
                    } else {
                      updatedSelectedAdditionalServices.push(additional_service);
                    }
                    setSelectedAdditionalServices(updatedSelectedAdditionalServices);
                  }}
                  width={320}
                />
              ))
            }
          </ScrollView>
          <View style={{width: '100%', paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#efefef'}}>
            <MainButton text="Далее" type="standard" onPress={to_third_step} defaultWidth={320}  />
          </View>
        </SafeAreaView>
      </View>
    </ProtectedRoute>
  )
}