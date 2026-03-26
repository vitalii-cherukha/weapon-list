import { create } from 'zustand';
import { hasPin, verifyPin, savePin } from '../security';

type AuthStore = {
  isLocked: boolean;
  isPinSet: boolean;
  init: () => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  setupPin: (pin: string) => Promise<void>;
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
}));
