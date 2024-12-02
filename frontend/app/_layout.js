import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen options={{headerShown: false}} name="index" />
        <Stack.Screen options={{headerShown: false}} name="auth/login" />
        <Stack.Screen options={{headerShown: false}} name="(drawer)" />
        <Stack.Screen options={{headerTitle: 'Шаг 2: Введите данные ковра'}} name="second_step" />
        <Stack.Screen options={{headerTitle: 'Шаг 3: Сделайте фото ковра'}} name="third_step" />
        <Stack.Screen options={{headerTitle: 'Шаг 4: Определение границ ковра'}} name="fourth_step" />
        <Stack.Screen options={{headerTitle: 'Шаг 5: Отправить клиенту'}} name="fifth_step" />
        <Stack.Screen
          name="cameras/[id]"
          options={({ route }) => {
            const { title } = route.params || {}; 
            return {
              headerTitle: `${title || "unknown"}`,
            };
          }}
        />
        <Stack.Screen
          name="cameras/calibration/[id]"
          options={({ route }) => {
            const { title } = route.params || {}; 
            return {
              headerTitle: `${title || "unknown"}`,
            };
          }}
        />
        <Stack.Screen
          name="cameras/calibration/[id]/calibrate"
          options={({ route }) => {
            const { title } = route.params || {}; 
            return {
              headerTitle: `Помостите квадрат 1 на 1 метр в синюю область`,
            };
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

