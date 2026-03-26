import { create } from 'zustand';
import { hasPin, verifyPin, savePin } from '../security';

type AuthStore = {
  isLocked: boolean;
  isPinSet: boolean;
  init: () => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  setupPin: (pin: string) => Promise<void>;
  changePin: (oldPin: string, newPin: string) => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLocked: true,
  isPinSet: false,

  init: async () => {
    const pinSet = await hasPin();
    set({ isPinSet: pinSet, isLocked: pinSet });
  },

  unlock: async (pin) => {
    const ok = await verifyPin(pin);
    if (ok) set({ isLocked: false });
    return ok;
  },

  setupPin: async (pin) => {
    await savePin(pin);
    set({ isPinSet: true, isLocked: false });
  },

  changePin: async (oldPin, newPin) => {
    const ok = await verifyPin(oldPin);
    if (!ok) return false;
    await savePin(newPin);
    return true;
  },
}));
