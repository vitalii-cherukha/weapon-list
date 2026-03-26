import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWeaponStore } from '../../weapon/store/weaponStore';
import { Weapon } from '../../weapon/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WeaponListScreen() {
  const { weapons, load, remove } = useWeaponStore();
  const nav = useNavigation<Nav>();

  useEffect(() => { load(); }, []);

  const confirmDelete = (id: string) => {
    Alert.alert('Видалити?', 'Цю дію не можна скасувати', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  const renderItem = ({ item }: { item: Weapon }) => (
    <TouchableOpacity style={s.item} onPress={() => nav.navigate('WeaponDetail', { id: item.id })}>
      <View style={s.row}>
        <Text style={s.model}>{item.model}</Text>
        <View style={[s.badge, item.status === 'STORAGE' ? s.storage : s.issued]}>
          <Text style={s.badgeText}>{item.status === 'STORAGE' ? 'Склад' : 'Видано'}</Text>
        </View>
      </View>
      <Text style={s.serial}>#{item.serialNumber}</Text>
      <Text style={s.owner}>{item.owner}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <FlatList
        data={weapons}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListEmptyComponent={<Text style={s.empty}>Зброї немає. Додайте першу.</Text>}
      />
      <View style={s.fab_row}>
        <TouchableOpacity style={s.fab} onPress={() => nav.navigate('QRScanner')}>
          <Text style={s.fabText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.fab} onPress={() => nav.navigate('AddWeapon')}>
          <Text style={s.fabText}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  item: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  model: { color: '#fff', fontSize: 16, fontWeight: '600' },
  serial: { color: '#888', fontSize: 13, marginTop: 4 },
  owner: { color: '#aaa', fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  storage: { backgroundColor: '#166534' },
  issued: { backgroundColor: '#7f1d1d' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 15 },
  fab_row: { position: 'absolute', bottom: 24, right: 20, gap: 12, flexDirection: 'row' },
  fab: { backgroundColor: '#2563eb', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 22 },
});
