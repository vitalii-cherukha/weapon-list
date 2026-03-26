import { create } from 'zustand';
import { Weapon, WeaponStatus } from '../types';
import { weaponDb } from '../db/weaponDb';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

type WeaponStore = {
  weapons: Weapon[];
  load: () => void;
  add: (data: Omit<Weapon, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  remove: (id: string) => void;
  updateStatus: (id: string, status: WeaponStatus) => void;
};

export const useWeaponStore = create<WeaponStore>((set) => ({
  weapons: [],

  load: () => {
    const weapons = weaponDb.getAll();
    set({ weapons });
  },

  add: (data) => {
    const now = Date.now();
    const weapon: Weapon = { ...data, id: uuid(), status: 'STORAGE', createdAt: now, updatedAt: now };
    weaponDb.insert(weapon);
    set((s) => ({ weapons: [weapon, ...s.weapons] }));
  },

  remove: (id) => {
    weaponDb.delete(id);
    set((s) => ({ weapons: s.weapons.filter((w) => w.id !== id) }));
  },

  updateStatus: (id, status) => {
    weaponDb.updateStatus(id, status);
    set((s) => ({
      weapons: s.weapons.map((w) => (w.id === id ? { ...w, status, updatedAt: Date.now() } : w)),
    }));
  },
}));
