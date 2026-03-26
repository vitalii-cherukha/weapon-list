import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '../../auth/store/authStore';
import { getFilePath, requestPublicFolder } from '../../../database/jsonStorage';

export function SettingsScreen() {
  const { changePin } = useAuthStore();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleChangePin = async () => {
    if (newPin.length < 4) return Alert.alert('Помилка', 'Новий PIN має бути мінімум 4 символи');
    if (newPin !== confirmPin) return Alert.alert('Помилка', 'Нові PIN-коди не збігаються');

    const ok = await changePin(oldPin, newPin);
    if (!ok) return Alert.alert('Помилка', 'Невірний поточний PIN');

    Alert.alert('Готово', 'PIN успішно змінено');
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.section}>
        <Text style={s.sectionTitle}>📁 Файл даних</Text>
        <Text style={s.filePath}>{getFilePath()}</Text>
        <Text style={s.hint}>Внутрішній файл. Щоб дані також зберігались у публічній папці (Documents) — виберіть папку нижче.</Text>
        <TouchableOpacity
          style={s.btn}
          onPress={async () => {
            const ok = await requestPublicFolder();
            Alert.alert(ok ? 'Готово' : 'Скасовано', ok ? 'Папку вибрано. Дані синхронізуватимуться автоматично.' : '');
          }}
        >
          <Text style={s.btnText}>📂 Вибрати публічну папку</Text>
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>🔐 Змінити PIN</Text>
        <PinInput label="Поточний PIN" value={oldPin} onChangeText={setOldPin} />
        <PinInput label="Новий PIN" value={newPin} onChangeText={setNewPin} />
        <PinInput label="Підтвердити новий PIN" value={confirmPin} onChangeText={setConfirmPin} />
        <TouchableOpacity style={s.btn} onPress={handleChangePin}>
          <Text style={s.btnText}>Змінити PIN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PinInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        secureTextEntry
        maxLength={8}
        placeholderTextColor="#555"
        placeholder="••••"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  content: { padding: 16, gap: 24 },
  section: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, gap: 12 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  filePath: { color: '#2563eb', fontSize: 12, fontFamily: 'monospace' },
  hint: { color: '#666', fontSize: 12, lineHeight: 18 },
  field: { gap: 6 },
  label: { color: '#888', fontSize: 13 },
  input: { backgroundColor: '#0f0f0f', color: '#fff', padding: 12, borderRadius: 10, fontSize: 18, letterSpacing: 4, borderWidth: 1, borderColor: '#2a2a2a' },
  btn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
