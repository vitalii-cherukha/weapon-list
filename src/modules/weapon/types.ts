export type WeaponStatus = 'STORAGE' | 'ISSUED';

export type Weapon = {
  id: string;
  model: string;
  serialNumber: string;
  owner: string;
  type: string;
  status: WeaponStatus;
  createdAt: number;
  updatedAt: number;
};
