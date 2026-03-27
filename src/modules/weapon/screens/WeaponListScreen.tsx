import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraIcon, PlusIcon } from '../../../shared/ui/icons';
import { useNavigation } from '@react-navigation/native';
import { useWeaponStore } from '../../weapon/store/weaponStore';
import { Weapon } from '../../weapon/types';
import { colors } from '../../../shared/constants/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WeaponListScreen() {
  const { weapons, load } = useWeaponStore();
  const nav = useNavigation<Nav>();

  useEffect(() => { load(); }, []);

  const renderItem = ({ item }: { item: Weapon }) => (
    <TouchableOpacity style={s.item} onPress={() => nav.navigate('WeaponDetail', { id: item.id })}>
      <View style={s.row}>
        <Text style={s.model}>{item.model}</Text>
        <View style={[s.badge, item.status === 'STORAGE' ? s.storageBadge : s.issuedBadge]}>
          <Text style={[s.badgeText, { color: item.status === 'STORAGE' ? colors.storageText : colors.issuedText }]}>
            {item.status === 'STORAGE' ? 'СКЛАД' : 'ВИДАНО'}
          </Text>
        </View>
      </View>
      <Text style={s.serial}>S/N: {item.serialNumber}</Text>
      <Text style={s.owner}>{item.owner} · {item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <FlatList
        data={weapons}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        ListEmptyComponent={<Text style={s.empty}>Записів немає. Додайте першу одиницю.</Text>}
      />
      <View style={s.fabRow}>
        <TouchableOpacity style={s.fab} onPress={() => nav.navigate('QRScanner')}>
          <CameraIcon size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={s.fab} onPress={() => nav.navigate('AddWeapon')}>
          <PlusIcon size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  item: { backgroundColor: colors.bgCard, borderRadius: 6, padding: 14, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  model: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  serial: { color: colors.textSecondary, fontSize: 12, marginTop: 5, fontFamily: 'monospace' },
  owner: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  storageBadge: { backgroundColor: colors.storage },
  issuedBadge: { backgroundColor: colors.issued },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 60, fontSize: 14 },
  fabRow: { position: 'absolute', bottom: 24, right: 20, gap: 12, flexDirection: 'row' },
  fab: { backgroundColor: colors.primary, width: 52, height: 52, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.primaryLight },
});
