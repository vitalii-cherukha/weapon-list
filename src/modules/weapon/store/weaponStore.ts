import { create } from 'zustand';
import { Weapon, WeaponStatus } from '../types';
import { readWeapons, writeWeapons } from '../../../database/jsonStorage';
import * as Crypto from 'expo-crypto';

function generateId(): string {
  return Crypto.randomUUID();
}

type WeaponStore = {
  weapons: Weapon[];
  load: () => Promise<void>;
  add: (data: Omit<Weapon, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  updateStatus: (id: string, status: WeaponStatus) => Promise<void>;
};

export const useWeaponStore = create<WeaponStore>((set, get) => ({
  weapons: [],

  load: async () => {
    const weapons = await readWeapons();
    set({ weapons });
  },

  add: async (data) => {
    const existing = get().weapons;
    if (existing.some((w) => w.serialNumber === data.serialNumber)) {
      throw new Error('duplicate_serial');
    }
    const now = Date.now();
    const weapon: Weapon = { ...data, id: generateId(), status: 'STORAGE', createdAt: now, updatedAt: now };
    const updated = [weapon, ...existing];
    try {
      await writeWeapons(updated);
    } catch (e) {
      console.error('[weaponStore] writeWeapons failed:', e);
      throw e;
    }
    set({ weapons: updated });
  },

  remove: async (id) => {
    const updated = get().weapons.filter((w) => w.id !== id);
    await writeWeapons(updated);
    set({ weapons: updated });
  },

  updateStatus: async (id, status) => {
    const updated = get().weapons.map((w) =>
      w.id === id ? { ...w, status, updatedAt: Date.now() } : w
    );
    await writeWeapons(updated);
    set({ weapons: updated });
  },
}));
