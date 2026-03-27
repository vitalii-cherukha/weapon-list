import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWeaponStore } from '../store/weaponStore';
import { colors } from '../../../shared/constants/colors';

export function AddWeaponScreen() {
  const nav = useNavigation();
  const { add } = useWeaponStore();
  const [form, setForm] = useState({ model: '', serialNumber: '', owner: '', type: '' });

  const set = (key: keyof typeof form) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleAdd = async () => {
    if (!form.model || !form.serialNumber || !form.owner || !form.type) {
      return Alert.alert('Заповніть всі поля');
    }
    try {
      await add(form);
      nav.goBack();
    } catch (e: any) {
      if (e?.message === 'duplicate_serial') {
        Alert.alert('Помилка', 'Серійний номер вже існує');
      } else {
        Alert.alert('Помилка', e?.message ?? 'Не вдалось зберегти');
      }
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Field label="МОДЕЛЬ" value={form.model} onChangeText={set('model')} />
      <Field label="СЕРІЙНИЙ НОМЕР" value={form.serialNumber} onChangeText={set('serialNumber')} mono />
      <Field label="ВЛАСНИК" value={form.owner} onChangeText={set('owner')} />
      <Field label="ТИП" value={form.type} onChangeText={set('type')} />
      <TouchableOpacity style={s.btn} onPress={handleAdd}>
        <Text style={s.btnText}>Додати запис</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, mono }: { label: string; value: string; onChangeText: (v: string) => void; mono?: boolean }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, mono && { fontFamily: 'monospace', letterSpacing: 1 }]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textMuted}
        placeholder={label.toLowerCase()}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  field: { gap: 6 },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  input: { backgroundColor: colors.bgCard, color: colors.textPrimary, padding: 12, borderRadius: 6, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  btn: { backgroundColor: colors.primary, padding: 16, borderRadius: 6, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: colors.primaryLight },
  btnText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', letterSpacing: 1 },
});
