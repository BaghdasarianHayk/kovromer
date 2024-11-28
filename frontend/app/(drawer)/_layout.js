import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
import FirstStep from './first_step';
import Cameras from './cameras';
import { Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const Drawer = createDrawerNavigator();

export default function Layout() {
  const { logout, currentWorker } = useAuth()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={
          (props) => (
            <DrawerContentScrollView contentContainerStyle={{justifyContent: 'space-between', minHeight: '100%'}} {...props}>
              <View>
                <View style={{width: '100%', gap: 4, borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 10, marginBottom: 10}}>
                  <Text numberOfLines={1} style={{fontSize: 16, fontWeight: '600'}}>{currentWorker?.email}</Text>
                  <Text numberOfLines={1} style={{fontSize: 12, opacity: 0.7}}>{currentWorker?.role}</Text>
                </View>
                <DrawerItemList {...props} />
              </View>
              <DrawerItem 
                label="Выйти"
                icon={({color}) => (
                  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <Path fillRule="evenodd" clipRule="evenodd" d="M13.4375 10C13.4375 9.65484 13.1577 9.37501 12.8125 9.37501H3.66869L5.30256 7.97454C5.56465 7.74991 5.595 7.35535 5.37036 7.09327C5.14572 6.83119 4.75116 6.80084 4.48908 7.02548L1.57241 9.52551C1.43388 9.64418 1.35416 9.81759 1.35416 10C1.35416 10.1824 1.43388 10.3558 1.57241 10.4745L4.48908 12.9745C4.75116 13.1992 5.14572 13.1688 5.37036 12.9068C5.595 12.6447 5.56465 12.2501 5.30256 12.0255L3.66869 10.625H12.8125C13.1577 10.625 13.4375 10.3452 13.4375 10Z" fill={color}/>
                    <Path d="M7.8125 6.66669C7.8125 7.25185 7.8125 7.54443 7.95293 7.7546C8.01373 7.84561 8.09187 7.92375 8.18288 7.98456C8.39308 8.12499 8.68567 8.12499 9.27083 8.12499H12.8125C13.848 8.12499 14.6875 8.96444 14.6875 10C14.6875 11.0355 13.848 11.875 12.8125 11.875H9.27083C8.68567 11.875 8.393 11.875 8.18283 12.0154C8.09186 12.0763 8.01375 12.1544 7.95296 12.2454C7.8125 12.4555 7.8125 12.7481 7.8125 13.3334C7.8125 15.6904 7.8125 16.8689 8.54475 17.6011C9.277 18.3334 10.4553 18.3334 12.8123 18.3334H13.6457C16.0027 18.3334 17.1812 18.3334 17.9134 17.6011C18.6457 16.8689 18.6457 15.6904 18.6457 13.3334V6.66669C18.6457 4.30967 18.6457 3.13115 17.9134 2.39892C17.1812 1.66669 16.0027 1.66669 13.6457 1.66669H12.8123C10.4553 1.66669 9.277 1.66669 8.54475 2.39892C7.8125 3.13115 7.8125 4.30966 7.8125 6.66669Z" fill={color}/>
                  </Svg>
                )}
                activeTintColor='#EB0000'
                inactiveTintColor='#EB0000'
                inactiveBackgroundColor='rgba(235, 0, 0, 0.05)'
                style={{borderRadius: 8}}
                onPress={logout}
              />
            </DrawerContentScrollView>
          )
        }
      >
        <Drawer.Screen
        name="first_step"
          component={FirstStep}
          options={{
            drawerStyle: {borderRadius: 0, borderBottomRightRadius: 0, borderTopRightRadius: 0},
            drawerItemStyle: {borderRadius: 8},
            drawerLabel: 'Новый заказ',
            title: 'Шаг 1: Сделайте фото ковра',
            drawerActiveBackgroundColor: 'rgba(0, 101, 253, 0.15)',
            drawerActiveTintColor: 'rgba(0, 101, 253, 1)',
            drawerInactiveTintColor: '#929292',
            drawerIcon: ({color}) => (
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <G clipPath="url(#clip0_1166_290)">
                  <Path fillRule="evenodd" clipRule="evenodd" d="M9.99999 18.3334C6.07161 18.3334 4.10743 18.3334 2.88705 17.1129C1.66666 15.8926 1.66666 13.9284 1.66666 10C1.66666 6.07164 1.66666 4.10746 2.88705 2.88708C4.10743 1.66669 6.07161 1.66669 9.99999 1.66669C13.9283 1.66669 15.8926 1.66669 17.1129 2.88708C18.3333 4.10746 18.3333 6.07164 18.3333 10C18.3333 13.9284 18.3333 15.8926 17.1129 17.1129C15.8926 18.3334 13.9283 18.3334 9.99999 18.3334ZM9.99999 6.87502C10.3452 6.87502 10.625 7.15484 10.625 7.50002V9.37502H12.5C12.8452 9.37502 13.125 9.65485 13.125 10C13.125 10.3452 12.8452 10.625 12.5 10.625H10.625V12.5C10.625 12.8452 10.3452 13.125 9.99999 13.125C9.65482 13.125 9.37499 12.8452 9.37499 12.5V10.625H7.49999C7.15481 10.625 6.87499 10.3452 6.87499 10C6.87499 9.65485 7.15481 9.37502 7.49999 9.37502H9.37499V7.50002C9.37499 7.15484 9.65482 6.87502 9.99999 6.87502Z" fill={color}/>
                </G>
                <Defs>
                  <ClipPath id="clip0_1166_290">
                    <Rect width="20" height="20" fill="white"/>
                  </ClipPath>
                </Defs>
              </Svg>
            )
          }}
        />
        <Drawer.Screen
          name="cameras"
          component={Cameras}
          options={{
            drawerStyle: {borderRadius: 0, borderBottomRightRadius: 0, borderTopRightRadius: 0},
            drawerItemStyle: {borderRadius: 8},
            drawerLabel: 'Камеры',
            title: 'Камеры',
            drawerActiveBackgroundColor: 'rgba(0, 101, 253, 0.15)',
            drawerActiveTintColor: 'rgba(0, 101, 253, 1)',
            drawerInactiveTintColor: '#929292',
            drawerIcon: ({color}) => (
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
                <G clipPath="url(#clip0_1166_749)">
                  <G clipPath="url(#clip1_1166_749)">
                    <G clipPath="url(#clip2_1166_749)">
                      <Path fillRule="evenodd" clipRule="evenodd" d="M10 9.16669C9.07951 9.16669 8.33334 9.91285 8.33334 10.8334C8.33334 11.7539 9.07951 12.5 10 12.5C10.9205 12.5 11.6667 11.7539 11.6667 10.8334C11.6667 9.91285 10.9205 9.16669 10 9.16669Z" fill={color}/>
                      <Path fillRule="evenodd" clipRule="evenodd" d="M18.3331 7.91996C18.3331 7.94791 18.333 7.97612 18.333 8.00462V13.3882C18.3331 14.1269 18.3331 14.7634 18.2646 15.2732C18.1912 15.8194 18.0255 16.343 17.6008 16.7678C17.1761 17.1925 16.6524 17.3581 16.1062 17.4315C15.5965 17.5001 14.9599 17.5 14.2212 17.5H5.77819C5.03945 17.5 4.40293 17.5001 3.89321 17.4315C3.34695 17.3581 2.82332 17.1925 2.3986 16.7678C1.97389 16.343 1.80826 15.8194 1.73482 15.2732C1.66629 14.7634 1.66633 14.1269 1.66637 13.3882V8.00462C1.66637 7.97612 1.66634 7.94791 1.66631 7.91996C1.66594 7.53569 1.66563 7.2044 1.73672 6.91108C1.95725 6.00126 2.66763 5.29088 3.57746 5.07035C3.87078 4.99926 4.20206 4.99957 4.58634 4.99994C4.61428 4.99997 4.64249 5 4.67099 5C4.95957 5 5.01767 4.99782 5.06459 4.99079C5.25469 4.9623 5.4291 4.86896 5.55826 4.72659C5.59014 4.69145 5.62418 4.64431 5.78425 4.40421L5.973 4.12108C5.99207 4.09246 6.01095 4.06406 6.02968 4.03589C6.3028 3.62501 6.54371 3.26262 6.88559 3.00458C7.0924 2.84848 7.32222 2.72549 7.56682 2.64C7.97116 2.49867 8.40634 2.49925 8.89967 2.49991C8.9335 2.49996 8.96767 2.5 9.002 2.5H10.9974C11.0318 2.5 11.0659 2.49996 11.0998 2.49991C11.5931 2.49925 12.0283 2.49867 12.4326 2.64C12.6772 2.72549 12.907 2.84848 13.1138 3.00458C13.4557 3.26262 13.6966 3.62502 13.9698 4.03589C13.9884 4.06406 14.0073 4.09247 14.0264 4.12108L14.2152 4.40421C14.3753 4.64431 14.4093 4.69145 14.4412 4.72659C14.5703 4.86896 14.7448 4.9623 14.9348 4.99079C14.9818 4.99782 15.0398 5 15.3284 5C15.3569 5 15.3852 4.99997 15.4131 4.99994C15.7973 4.99957 16.1287 4.99926 16.4219 5.07035C17.3318 5.29088 18.0422 6.00126 18.2627 6.91108C18.3338 7.2044 18.3334 7.53569 18.3331 7.91996ZM6.66648 10.8334C6.66648 8.99244 8.15886 7.50002 9.99984 7.50002C11.8408 7.50002 13.3332 8.99244 13.3332 10.8334C13.3332 12.6743 11.8408 14.1667 9.99984 14.1667C8.15886 14.1667 6.66648 12.6743 6.66648 10.8334Z" fill={color}/>
                    </G>
                  </G>
                </G>
                <Defs>
                  <ClipPath id="clip0_1166_749">
                    <Rect width="20" height="20" fill="white"/>
                  </ClipPath>
                  <ClipPath id="clip1_1166_749">
                    <Rect width="20" height="20" fill="white"/>
                  </ClipPath>
                  <ClipPath id="clip2_1166_749">
                    <Rect width="20" height="20" fill="white"/>
                  </ClipPath>
                </Defs>
              </Svg>
            )
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
