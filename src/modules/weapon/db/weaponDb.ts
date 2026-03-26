import { db } from '../../../database/client';
import { Weapon, WeaponStatus } from '../types';

export const weaponDb = {
  getAll(): Weapon[] {
    return db.getAllSync<Weapon>('SELECT * FROM weapons ORDER BY createdAt DESC');
  },

  insert(w: Weapon): void {
    db.runSync(
      'INSERT INTO weapons (id, model, serialNumber, owner, type, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [w.id, w.model, w.serialNumber, w.owner, w.type, w.status, w.createdAt, w.updatedAt]
    );
  },

  delete(id: string): void {
    db.runSync('DELETE FROM weapons WHERE id = ?', [id]);
  },

  updateStatus(id: string, status: WeaponStatus): void {
    db.runSync('UPDATE weapons SET status = ?, updatedAt = ? WHERE id = ?', [status, Date.now(), id]);
  },

  findBySerial(serialNumber: string): Weapon | null {
    return db.getFirstSync<Weapon>('SELECT * FROM weapons WHERE serialNumber = ?', [serialNumber]) ?? null;
  },
};
