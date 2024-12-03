import { SafeAreaView, View, Image, useWindowDimensions, Text } from "react-native";
import ProtectedRoute from "../components/ProtectedRoute";
import { ScrollView } from "react-native-gesture-handler";
import MainButton from "../components/MainButton";
import MainTextInput from "../components/MainTextInput";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Svg, {Path} from "react-native-svg";
import CheckBox from "../components/CheckBox";
import { useAuth } from "../context/AuthContext";

export default function FifthStep(){

    const localParams = useLocalSearchParams()
    const vw = useWindowDimensions().width

    const [serverImage, setServerImage] = useState(localParams.serverImage)
    const [width, setWidth] = useState(localParams.width)
    const [length, setLength] = useState(localParams.length)

    const [orderNumber, setOrderNumber] = useState(localParams.orderNumber)
    const [customerFullName, setCustomerFullName] = useState(localParams.customerFullName)
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState(localParams.customerPhoneNumber)
    const [comment, setComment] = useState(localParams.comment)
    const [carpetNumber, setCarpetNumber] = useState(localParams.carpetNumber)
    const [selectedType, setSelectedType] = useState(JSON.parse(localParams.selectedType))
    const [selectedAdditionalServices, setSelectedAdditionalServices] = useState(JSON.parse(localParams.selectedAdditionalServices))

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

    return(
        <ProtectedRoute>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                    <ScrollView style={{flex: 1}} contentContainerStyle={{width: '100%', height: '100%', alignItems: 'center', paddingTop: 10, gap: 10}}>
                        <Image source={{ uri: serverImage }} style={{borderRadius: 8, width: 320, maxWidth: vw - 40, aspectRatio: 1}} resizeMode="cover" />
                        
                        <MainTextInput 
                        value={width}
                        onChangeText={setWidth}
                        label="Ширина"
                        placeholder="Ширина"
                        width={320}
                        SvgIcon={() => (
                            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <Path fillRule="evenodd" clipRule="evenodd" d="M4.65485 3.82153C4.16669 4.30968 4.16669 5.09536 4.16669 6.66671V14.1667C4.16669 15.738 4.16669 16.5237 4.65485 17.0119C5.143 17.5 5.92867 17.5 7.50002 17.5H12.5C14.0714 17.5 14.857 17.5 15.3452 17.0119C15.8334 16.5237 15.8334 15.738 15.8334 14.1667V6.66671C15.8334 5.09536 15.8334 4.30968 15.3452 3.82153C14.857 3.33337 14.0714 3.33337 12.5 3.33337H7.50002C5.92867 3.33337 5.143 3.33337 4.65485 3.82153ZM7.50002 6.66671C7.03979 6.66671 6.66669 7.03981 6.66669 7.50004C6.66669 7.96027 7.03979 8.33337 7.50002 8.33337H12.5C12.9603 8.33337 13.3334 7.96027 13.3334 7.50004C13.3334 7.03981 12.9603 6.66671 12.5 6.66671H7.50002ZM7.50002 10C7.03979 10 6.66669 10.3731 6.66669 10.8334C6.66669 11.2936 7.03979 11.6667 7.50002 11.6667H12.5C12.9603 11.6667 13.3334 11.2936 13.3334 10.8334C13.3334 10.3731 12.9603 10 12.5 10H7.50002ZM7.50002 13.3334C7.03979 13.3334 6.66669 13.7065 6.66669 14.1667C6.66669 14.627 7.03979 15 7.50002 15H10.8334C11.2936 15 11.6667 14.627 11.6667 14.1667C11.6667 13.7065 11.2936 13.3334 10.8334 13.3334H7.50002Z" fill={orderNumber.length > 0 ? "black" : "#D5D5D5"}/>
                            </Svg>
                        )}
                        />

                        <MainTextInput 
                        value={length}
                        onChangeText={setLength}
                        label="Длина"
                        placeholder="Длина"
                        width={320}
                        SvgIcon={() => (
                            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <Path fillRule="evenodd" clipRule="evenodd" d="M4.65485 3.82153C4.16669 4.30968 4.16669 5.09536 4.16669 6.66671V14.1667C4.16669 15.738 4.16669 16.5237 4.65485 17.0119C5.143 17.5 5.92867 17.5 7.50002 17.5H12.5C14.0714 17.5 14.857 17.5 15.3452 17.0119C15.8334 16.5237 15.8334 15.738 15.8334 14.1667V6.66671C15.8334 5.09536 15.8334 4.30968 15.3452 3.82153C14.857 3.33337 14.0714 3.33337 12.5 3.33337H7.50002C5.92867 3.33337 5.143 3.33337 4.65485 3.82153ZM7.50002 6.66671C7.03979 6.66671 6.66669 7.03981 6.66669 7.50004C6.66669 7.96027 7.03979 8.33337 7.50002 8.33337H12.5C12.9603 8.33337 13.3334 7.96027 13.3334 7.50004C13.3334 7.03981 12.9603 6.66671 12.5 6.66671H7.50002ZM7.50002 10C7.03979 10 6.66669 10.3731 6.66669 10.8334C6.66669 11.2936 7.03979 11.6667 7.50002 11.6667H12.5C12.9603 11.6667 13.3334 11.2936 13.3334 10.8334C13.3334 10.3731 12.9603 10 12.5 10H7.50002ZM7.50002 13.3334C7.03979 13.3334 6.66669 13.7065 6.66669 14.1667C6.66669 14.627 7.03979 15 7.50002 15H10.8334C11.2936 15 11.6667 14.627 11.6667 14.1667C11.6667 13.7065 11.2936 13.3334 10.8334 13.3334H7.50002Z" fill={orderNumber.length > 0 ? "black" : "#D5D5D5"}/>
                            </Svg>
                        )}
                        />
                        
                        <MainTextInput 
                        value={orderNumber}
                        onChangeText={setOrderNumber}
                        label="Номер заказа"
                        placeholder="Номера заказа"
                        width={320}
                        SvgIcon={() => (
                            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <Path fillRule="evenodd" clipRule="evenodd" d="M4.65485 3.82153C4.16669 4.30968 4.16669 5.09536 4.16669 6.66671V14.1667C4.16669 15.738 4.16669 16.5237 4.65485 17.0119C5.143 17.5 5.92867 17.5 7.50002 17.5H12.5C14.0714 17.5 14.857 17.5 15.3452 17.0119C15.8334 16.5237 15.8334 15.738 15.8334 14.1667V6.66671C15.8334 5.09536 15.8334 4.30968 15.3452 3.82153C14.857 3.33337 14.0714 3.33337 12.5 3.33337H7.50002C5.92867 3.33337 5.143 3.33337 4.65485 3.82153ZM7.50002 6.66671C7.03979 6.66671 6.66669 7.03981 6.66669 7.50004C6.66669 7.96027 7.03979 8.33337 7.50002 8.33337H12.5C12.9603 8.33337 13.3334 7.96027 13.3334 7.50004C13.3334 7.03981 12.9603 6.66671 12.5 6.66671H7.50002ZM7.50002 10C7.03979 10 6.66669 10.3731 6.66669 10.8334C6.66669 11.2936 7.03979 11.6667 7.50002 11.6667H12.5C12.9603 11.6667 13.3334 11.2936 13.3334 10.8334C13.3334 10.3731 12.9603 10 12.5 10H7.50002ZM7.50002 13.3334C7.03979 13.3334 6.66669 13.7065 6.66669 14.1667C6.66669 14.627 7.03979 15 7.50002 15H10.8334C11.2936 15 11.6667 14.627 11.6667 14.1667C11.6667 13.7065 11.2936 13.3334 10.8334 13.3334H7.50002Z" fill={orderNumber.length > 0 ? "black" : "#D5D5D5"}/>
                            </Svg>
                        )}
                        />

                        <MainTextInput 
                        value={customerFullName}
                        onChangeText={setCustomerFullName}
                        label="ФИО заказчика"
                        placeholder="ФИО заказчика"
                        width={320}
                        SvgIcon={() => ( 
                            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <Path d="M10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10C12.2092 10 14 8.20914 14 6C14 3.79086 12.2092 2 10 2Z" fill={customerFullName.length > 0 ? "black" : "#D5D5D5"}/>
                            <Path d="M6.5 11C4.56701 11 3 12.7411 3 14.8889V17.2222C3 17.6518 3.3134 18 3.7 18H16.3C16.6866 18 17 17.6518 17 17.2222V14.8889C17 12.7411 15.433 11 13.5 11H6.5Z" fill={customerFullName.length > 0 ? "black" : "#D5D5D5"}/>
                            </Svg>
                        )}
                        />

                        <MainTextInput 
                        value={customerPhoneNumber}
                        onChangeText={setCustomerPhoneNumber}
                        label="Номер телефона"
                        placeholder="+71234567890"
                        width={320}
                        SvgIcon={() => (   
                            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <Path d="M3.00412 4.77914C2.9335 3.77864 3.78071 3 4.78165 3H6.92424C7.43804 3 7.90145 3.30958 8.09906 3.78483L8.99501 5.93958C9.21327 6.46448 9.05836 7.07075 8.61526 7.42598L8.05676 7.87371C7.80751 8.07352 7.72278 8.41805 7.87056 8.70128C8.63003 10.1568 9.75248 11.392 11.1175 12.2866C11.4056 12.4754 11.7862 12.4002 12.0012 12.131L12.5831 11.402C12.9376 10.958 13.5426 10.8028 14.0664 11.0215L16.2168 11.9193C16.6911 12.1173 17 12.5817 17 13.0965V15.2498C17 16.2529 16.1942 17.0667 15.1958 16.9957C8.81147 16.5415 3.45673 11.1911 3.00412 4.77914Z" fill={customerPhoneNumber.length > 0 ? "black" : "#D5D5D5"}/>
                            </Svg>
                        )}
                        />

                        <MainTextInput 
                        value={comment}
                        onChangeText={setComment}
                        label="Комментарий"
                        placeholder="Комментарий к заказу..."
                        width={320}
                        SvgIcon={() => ( 
                            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <Path d="M17.5 4.375V11.875C17.5 12.3723 17.3025 12.8492 16.9508 13.2008C16.5992 13.5525 16.1223 13.75 15.625 13.75H10.9375L4.375 17.5L5.3125 13.75H4.375C3.87772 13.75 3.40081 13.5525 3.04917 13.2008C2.69754 12.8492 2.5 12.3723 2.5 11.875V4.375C2.5 3.87772 2.69754 3.40081 3.04917 3.04917C3.40081 2.69754 3.87772 2.5 4.375 2.5H15.625C16.1223 2.5 16.5992 2.69754 16.9508 3.04917C17.3025 3.40081 17.5 3.87772 17.5 4.375Z" fill={comment.length > 0 ? "black" : "#D5D5D5"}/>
                            </Svg>
                        )}
                        />

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

                        
                        <Text style={{maxWidth: vw - 40, width: 320, fontWeight: '500', opacity: 0.8, marginTop: 10}}>Тип ворса</Text>
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

                        <Text style={{maxWidth: vw - 40, width: 320, fontWeight: '500', opacity: 0.8, marginTop: 10}}>Дополнительные услуги</Text>
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
                        <MainButton text="Далее" type="standard" defaultWidth={320}  />
                    </View>
                </SafeAreaView>
            </View>
        </ProtectedRoute>
    )
}