import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';

export function LockScreen() {
  const [pin, setPin] = useState('');
  const { isLocked, isPinSet, unlock, setupPin } = useAuthStore();

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
      <Text style={s.title}>{isPinSet ? '🔒 Введіть PIN' : '🔐 Встановіть PIN'}</Text>
      <TextInput
        style={s.input}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        secureTextEntry
        maxLength={8}
        placeholder="••••"
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={s.btn} onPress={handleSubmit}>
        <Text style={s.btnText}>{isPinSet ? 'Увійти' : 'Зберегти PIN'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f', gap: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#333', color: '#fff', fontSize: 24, letterSpacing: 8, padding: 12, borderRadius: 10, width: 180, textAlign: 'center', backgroundColor: '#1a1a1a' },
  btn: { backgroundColor: '#2563eb', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
