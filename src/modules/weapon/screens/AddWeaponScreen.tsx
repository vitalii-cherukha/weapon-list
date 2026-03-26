import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWeaponStore } from '../store/weaponStore';

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
      <Field label="Модель" value={form.model} onChangeText={set('model')} />
      <Field label="Серійний номер" value={form.serialNumber} onChangeText={set('serialNumber')} />
      <Field label="Власник" value={form.owner} onChangeText={set('owner')} />
      <Field label="Тип" value={form.type} onChangeText={set('type')} />
      <TouchableOpacity style={s.btn} onPress={handleAdd}>
        <Text style={s.btnText}>Додати</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} value={value} onChangeText={onChangeText} placeholderTextColor="#555" placeholder={label} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  content: { padding: 16, gap: 14 },
  field: { gap: 6 },
  label: { color: '#888', fontSize: 13 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', padding: 12, borderRadius: 10, fontSize: 15, borderWidth: 1, borderColor: '#2a2a2a' },
  btn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
