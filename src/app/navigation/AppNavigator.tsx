import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeaponListScreen } from '../../modules/weapon/screens/WeaponListScreen';
import { WeaponDetailScreen } from '../../modules/weapon/screens/WeaponDetailScreen';
import { AddWeaponScreen } from '../../modules/weapon/screens/AddWeaponScreen';
import { SettingsScreen } from '../../modules/weapon/screens/SettingsScreen';
import { QRScannerScreen } from '../../modules/qr/QRScannerScreen';
import type { RootStackParamList } from './types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: '#0f0f0f' },
  headerTintColor: '#fff',
  contentStyle: { backgroundColor: '#0f0f0f' },
};

function GearButton({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'WeaponList'> }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <Text style={{ fontSize: 20, marginRight: 4 }}>⚙️</Text>
    </TouchableOpacity>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="WeaponList"
          component={WeaponListScreen}
          options={({ navigation }) => ({
            title: '🔫 Облік зброї',
            headerRight: () => <GearButton navigation={navigation} />,
          })}
        />
        <Stack.Screen name="WeaponDetail" component={WeaponDetailScreen} options={{ title: 'Деталі' }} />
        <Stack.Screen name="AddWeapon" component={AddWeaponScreen} options={{ title: 'Додати зброю' }} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: 'QR Сканер' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Налаштування' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
