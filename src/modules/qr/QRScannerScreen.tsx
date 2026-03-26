import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useWeaponStore } from '../weapon/store/weaponStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function QRScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { weapons, updateStatus } = useWeaponStore();
  const nav = useNavigation<Nav>();

  if (!permission) return <View style={s.container} />;
  if (!permission.granted) {
    requestPermission();
    return <View style={s.container}><Text style={s.text}>Потрібен доступ до камери</Text></View>;
  }

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const weapon = weapons.find((w) => w.serialNumber === data);
    if (!weapon) {
      Alert.alert('Не знайдено', `Серійний номер: ${data}`, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
      return;
    }

    const next = weapon.status === 'STORAGE' ? 'ISSUED' : 'STORAGE';
    await updateStatus(weapon.id, next);
    Alert.alert(
      'Статус змінено',
      `${weapon.model}\n${weapon.status} → ${next}`,
      [{ text: 'OK', onPress: () => nav.goBack() }]
    );
  };

  return (
    <View style={s.container}>
      <CameraView
        style={s.camera}
        facing="back"
        onBarcodeScanned={handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        <View style={s.overlay}>
          <View style={s.frame} />
          <Text style={s.hint}>Наведіть на QR-код зброї</Text>
        </View>
      </CameraView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  frame: { width: 220, height: 220, borderWidth: 2, borderColor: '#2563eb', borderRadius: 12 },
  hint: { color: '#fff', fontSize: 14, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 },
  text: { color: '#fff', textAlign: 'center', marginTop: 60 },
});
