import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { LockIcon, LockSetupIcon, AK74Icon } from '../../../shared/ui/icons';
import { colors } from '../../../shared/constants/colors';

export function LockScreen() {
  const [pin, setPin] = useState('');
  const { isPinSet, unlock, setupPin } = useAuthStore();

  const handleSubmit = async () => {
    if (!isPinSet) {
      if (pin.length < 4) return Alert.alert('PIN має бути мінімум 4 символи');
      await setupPin(pin);
    } else {
      const ok = await unlock(pin);
      if (!ok) Alert.alert('Невірний PIN');
    }
    setPin('');
  };

  return (
    <View style={s.container}>
      <AK74Icon size={80} color={colors.accent} />
      <View style={s.lockRow}>
        {isPinSet
          ? <LockIcon size={18} color={colors.textMuted} />
          : <LockSetupIcon size={18} color={colors.textMuted} />}
        <Text style={s.title}>{isPinSet ? 'Введіть PIN' : 'Встановіть PIN'}</Text>
      </View>
      <TextInput
        style={s.input}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        secureTextEntry
        maxLength={8}
        placeholder="••••"
        placeholderTextColor={colors.textMuted}
      />
      <TouchableOpacity style={s.btn} onPress={handleSubmit}>
        <Text style={s.btnText}>{isPinSet ? 'Увійти' : 'Зберегти PIN'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, gap: 16 },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '600', letterSpacing: 1 },
  input: { borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, fontSize: 24, letterSpacing: 8, padding: 12, borderRadius: 6, width: 180, textAlign: 'center', backgroundColor: colors.bgInput },
  btn: { backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 6, borderWidth: 1, borderColor: colors.primaryLight },
  btnText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', letterSpacing: 1 },
});
