import React, { useEffect } from 'react';
import { useAuthStore } from '../modules/auth/store/authStore';
import { LockScreen } from '../modules/auth/screens/LockScreen';
import { AppNavigator } from './navigation/AppNavigator';
import { initDB } from '../database/schema';

initDB();

export function AppRoot() {
  const { isLocked, isPinSet, init } = useAuthStore();

  useEffect(() => { init(); }, []);

  if (isLocked || !isPinSet) return <LockScreen />;
  return <AppNavigator />;
}
