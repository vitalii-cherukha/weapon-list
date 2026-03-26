import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeaponListScreen } from '../../modules/weapon/screens/WeaponListScreen';
import { WeaponDetailScreen } from '../../modules/weapon/screens/WeaponDetailScreen';
import { AddWeaponScreen } from '../../modules/weapon/screens/AddWeaponScreen';
import { QRScannerScreen } from '../../modules/qr/QRScannerScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0f0f0f' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#0f0f0f' },
        }}
      >
        <Stack.Screen name="WeaponList" component={WeaponListScreen} options={{ title: '🔫 Облік зброї' }} />
        <Stack.Screen name="WeaponDetail" component={WeaponDetailScreen} options={{ title: 'Деталі' }} />
        <Stack.Screen name="AddWeapon" component={AddWeaponScreen} options={{ title: 'Додати зброю' }} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: 'QR Сканер' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
