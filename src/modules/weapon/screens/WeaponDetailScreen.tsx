import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useWeaponStore } from '../store/weaponStore';
import type { RootStackParamList } from '../../../app/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Route = RouteProp<RootStackParamList, 'WeaponDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WeaponDetailScreen() {
  const { params } = useRoute<Route>();
  const nav = useNavigation<Nav>();
  const { weapons, updateStatus, remove } = useWeaponStore();
  const weapon = weapons.find((w) => w.id === params.id);

  if (!weapon) return <View style={s.container}><Text style={s.empty}>Не знайдено</Text></View>;

  const toggle = () => {
    const next = weapon.status === 'STORAGE' ? 'ISSUED' : 'STORAGE';
    updateStatus(weapon.id, next);
  };

  const confirmDelete = () => {
    Alert.alert('Видалити?', '', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => { remove(weapon.id); nav.goBack(); } },
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Row label="Модель" value={weapon.model} />
        <Row label="Серійний №" value={weapon.serialNumber} />
        <Row label="Власник" value={weapon.owner} />
        <Row label="Тип" value={weapon.type} />
        <Row label="Статус" value={weapon.status === 'STORAGE' ? '📦 Склад' : '🔫 Видано'} />
      </View>
      <TouchableOpacity style={[s.btn, weapon.status === 'STORAGE' ? s.issue : s.ret]} onPress={toggle}>
        <Text style={s.btnText}>{weapon.status === 'STORAGE' ? 'Видати' : 'Повернути'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.del} onPress={confirmDelete}>
        <Text style={s.delText}>Видалити запис</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#888', fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '500' },
  btn: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  issue: { backgroundColor: '#7f1d1d' },
  ret: { backgroundColor: '#166534' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  del: { marginTop: 12, padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#7f1d1d' },
  delText: { color: '#ef4444', fontSize: 15 },
  empty: { color: '#555', textAlign: 'center', marginTop: 60 },
});
