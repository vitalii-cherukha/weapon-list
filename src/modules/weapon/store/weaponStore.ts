import { create } from 'zustand';
import { Weapon, WeaponStatus } from '../types';
import { readWeapons, writeWeapons } from '../../../database/jsonStorage';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

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
    const weapon: Weapon = { ...data, id: uuid(), status: 'STORAGE', createdAt: now, updatedAt: now };
    const updated = [weapon, ...existing];
    await writeWeapons(updated);
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
