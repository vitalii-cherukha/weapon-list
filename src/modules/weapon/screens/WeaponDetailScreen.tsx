import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useWeaponStore } from '../store/weaponStore';
import { BoxIcon, WeaponIcon, IssueIcon, ReturnIcon, TrashIcon } from '../../../shared/ui/icons';
import { colors } from '../../../shared/constants/colors';
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

  const isStorage = weapon.status === 'STORAGE';

  const toggle = () => updateStatus(weapon.id, isStorage ? 'ISSUED' : 'STORAGE');

  const confirmDelete = () => {
    Alert.alert('Видалити запис?', weapon.model, [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => { remove(weapon.id); nav.goBack(); } },
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Row label="МОДЕЛЬ" value={weapon.model} />
        <Row label="СЕРІЙНИЙ №" value={weapon.serialNumber} mono />
        <Row label="ВЛАСНИК" value={weapon.owner} />
        <Row label="ТИП" value={weapon.type} />
        <View style={s.row}>
          <Text style={s.label}>СТАТУС</Text>
          <View style={[s.statusBadge, isStorage ? s.storageBadge : s.issuedBadge]}>
            {isStorage
              ? <BoxIcon size={14} color={colors.storageText} />
              : <WeaponIcon size={14} color={colors.issuedText} />}
            <Text style={[s.statusText, { color: isStorage ? colors.storageText : colors.issuedText }]}>
              {isStorage ? 'СКЛАД' : 'ВИДАНО'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={[s.btn, isStorage ? s.issueBtn : s.retBtn]} onPress={toggle}>
        <View style={s.btnInner}>
          {isStorage ? <IssueIcon size={20} color={colors.textPrimary} /> : <ReturnIcon size={20} color={colors.textPrimary} />}
          <Text style={s.btnText}>{isStorage ? 'Видати' : 'Повернути'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={s.delBtn} onPress={confirmDelete}>
        <View style={s.btnInner}>
          <TrashIcon size={18} color={colors.dangerText} />
          <Text style={s.delText}>Видалити запис</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={[s.value, mono && { fontFamily: 'monospace' }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  card: { backgroundColor: colors.bgCard, borderRadius: 6, padding: 16, gap: 14, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  value: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  storageBadge: { backgroundColor: colors.storage },
  issuedBadge: { backgroundColor: colors.issued },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  btn: { marginTop: 20, padding: 16, borderRadius: 6, alignItems: 'center', borderWidth: 1 },
  issueBtn: { backgroundColor: colors.issued, borderColor: colors.dangerText },
  retBtn: { backgroundColor: colors.storage, borderColor: colors.storageText },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  delBtn: { marginTop: 10, padding: 14, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: colors.danger },
  delText: { color: colors.dangerText, fontSize: 15 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 60 },
});
