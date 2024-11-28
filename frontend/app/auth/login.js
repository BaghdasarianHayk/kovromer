import { useState } from "react";
import { Text, useWindowDimensions, SafeAreaView, ScrollView, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import MainButton from '../../components/MainButton';
import Svg, { Path } from "react-native-svg";
import MainTextInput from "../../components/MainTextInput";

export default function LoginScreen() {
  const { login } = useAuth();

  const vw = useWindowDimensions().width
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'center', backgroundColor: 'white', gap: 10, justifyContent: 'center', minHeight: '100%', paddingVertical: 20}}>
          <Text style={{width: 320, maxWidth: vw-40, fontSize: 24, fontWeight: '600'}}>Войдите в систему, чтобы продолжить работу</Text>
          
          <MainTextInput 
            value={email}
            onChangeText={setEmail}
            placeholder="Эл. адрес"
            width={320}
            SvgIcon={() => (
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <Path d="M18.3333 6.93335V15C18.3333 15.442 18.1577 15.866 17.8452 16.1785C17.5326 16.4911 17.1087 16.6667 16.6667 16.6667H3.33334C2.89131 16.6667 2.46739 16.4911 2.15483 16.1785C1.84227 15.866 1.66667 15.442 1.66667 15V7.24168L3.33334 8.15002L9.60001 11.5667C9.72286 11.633 9.8604 11.6674 10 11.6667C10.1467 11.6652 10.2905 11.6249 10.4167 11.55L16.6667 7.90835L18.3333 6.93335Z" fill={email.length > 0 ? "black" : "#D5D5D5"} />
                  <Path d="M18.3333 4.99998L16.6667 5.98331L10 9.87498L3.33334 6.24998L1.66667 5.33331V4.99998C1.66667 4.55795 1.84227 4.13403 2.15483 3.82147C2.46739 3.50891 2.89131 3.33331 3.33334 3.33331H16.6667C17.1087 3.33331 17.5326 3.50891 17.8452 3.82147C18.1577 4.13403 18.3333 4.55795 18.3333 4.99998Z" fill={email.length > 0 ? "black" : "#D5D5D5"} />
              </Svg>
            )}
          />

          <MainTextInput 
            placeholder="Пароль"
            width={320}
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            SvgIcon={() => (
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path fillRule="evenodd" clipRule="evenodd" d="M5.625 9.125V6.875C5.625 5.58207 6.13862 4.34209 7.05286 3.42786C7.96709 2.51362 9.20708 2 10.5 2C11.7929 2 13.0329 2.51362 13.9472 3.42786C14.8614 4.34209 15.375 5.58207 15.375 6.875V9.125H15.75C16.9927 9.125 18 10.1323 18 11.375V16.625C18 17.8677 16.9927 18.875 15.75 18.875H5.25C4.00736 18.875 3 17.8677 3 16.625V11.375C3 10.1323 4.00736 9.125 5.25 9.125H5.625ZM8.64385 5.01885C9.13613 4.52656 9.80377 4.25 10.5 4.25C11.1962 4.25 11.8639 4.52656 12.3562 5.01885C12.8485 5.51112 13.125 6.1788 13.125 6.875V9.125H7.875V6.875C7.875 6.1788 8.15156 5.51112 8.64385 5.01885Z" fill={password.length > 0 ? "black" : "#D5D5D5"} />
              </Svg>
            )}
          />
          
          <MainButton text="Войти" type="standard" defaultWidth={320} onPress={() => login(email, password)} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
