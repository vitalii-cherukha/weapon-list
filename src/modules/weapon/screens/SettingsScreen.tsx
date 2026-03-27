import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '../../auth/store/authStore';
import { getFilePath, requestPublicFolder } from '../../../database/jsonStorage';
import { FolderIcon, FolderOpenIcon, LockSetupIcon } from '../../../shared/ui/icons';
import { colors } from '../../../shared/constants/colors';

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
    setOldPin(''); setNewPin(''); setConfirmPin('');
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <FolderIcon size={16} color={colors.accent} />
          <Text style={s.sectionTitle}>ФАЙЛ ДАНИХ</Text>
        </View>
        <Text style={s.filePath}>{getFilePath()}</Text>
        <Text style={s.hint}>Внутрішній файл. Щоб дані також зберігались у публічній папці — виберіть папку нижче.</Text>
        <TouchableOpacity
          style={s.btn}
          onPress={async () => {
            const ok = await requestPublicFolder();
            Alert.alert(ok ? 'Готово' : 'Скасовано', ok ? 'Папку вибрано. Дані синхронізуватимуться автоматично.' : '');
          }}
        >
          <View style={s.btnInner}>
            <FolderOpenIcon size={16} color={colors.textPrimary} />
            <Text style={s.btnText}>Вибрати публічну папку</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <View style={s.sectionHeader}>
          <LockSetupIcon size={16} color={colors.accent} />
          <Text style={s.sectionTitle}>ЗМІНИТИ PIN</Text>
        </View>
        <PinInput label="ПОТОЧНИЙ PIN" value={oldPin} onChangeText={setOldPin} />
        <PinInput label="НОВИЙ PIN" value={newPin} onChangeText={setNewPin} />
        <PinInput label="ПІДТВЕРДИТИ PIN" value={confirmPin} onChangeText={setConfirmPin} />
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
        placeholderTextColor={colors.textMuted}
        placeholder="••••"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 20 },
  section: { backgroundColor: colors.bgCard, borderRadius: 6, padding: 16, gap: 12, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
  filePath: { color: colors.accent, fontSize: 11, fontFamily: 'monospace' },
  hint: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  field: { gap: 6 },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  input: { backgroundColor: colors.bg, color: colors.textPrimary, padding: 12, borderRadius: 6, fontSize: 18, letterSpacing: 4, borderWidth: 1, borderColor: colors.border },
  btn: { backgroundColor: colors.primary, padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 4, borderWidth: 1, borderColor: colors.primaryLight },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { color: colors.textPrimary, fontSize: 15, fontWeight: '600', letterSpacing: 0.5 },
});
