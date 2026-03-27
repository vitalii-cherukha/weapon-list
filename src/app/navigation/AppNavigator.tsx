import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeaponListScreen } from '../../modules/weapon/screens/WeaponListScreen';
import { WeaponDetailScreen } from '../../modules/weapon/screens/WeaponDetailScreen';
import { AddWeaponScreen } from '../../modules/weapon/screens/AddWeaponScreen';
import { SettingsScreen } from '../../modules/weapon/screens/SettingsScreen';
import { QRScannerScreen } from '../../modules/qr/QRScannerScreen';
import type { RootStackParamList } from './types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GearIcon } from '../../shared/ui/icons';

import { colors } from '../../shared/constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.bgCard },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: '700' as const, letterSpacing: 1 },
  contentStyle: { backgroundColor: colors.bg },
};

function GearButton({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'WeaponList'> }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
      style={{ padding: 4, justifyContent: 'center', alignItems: 'center' }}
    >
      <GearIcon size={22} color="#fff" />
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
            title: 'Облік зброї',
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
