import * as FileSystem from 'expo-file-system/legacy';
import { Weapon } from '../modules/weapon/types';

const { StorageAccessFramework } = FileSystem;

function getInternalFile(): string {
  const base = FileSystem.documentDirectory;
  if (!base) throw new Error('FileSystem not ready');
  return base + 'weapons.json';
}

function getSafUriFile(): string {
  const base = FileSystem.documentDirectory;
  if (!base) throw new Error('FileSystem not ready');
  return base + '.saf_uri';
}

async function ensureInternal(): Promise<void> {
  const file = getInternalFile();
  const info = await FileSystem.getInfoAsync(file);
  if (!info.exists) {
    await FileSystem.writeAsStringAsync(file, '[]');
  }
}

async function getSafUri(): Promise<string | null> {
  try {
    const key = getSafUriFile();
    const info = await FileSystem.getInfoAsync(key);
    if (!info.exists) return null;
    return await FileSystem.readAsStringAsync(key);
  } catch {
    return null;
  }
}

export async function requestPublicFolder(): Promise<boolean> {
  try {
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) return false;
    await FileSystem.writeAsStringAsync(getSafUriFile(), permissions.directoryUri);
    return true;
  } catch {
    return false;
  }
}

async function syncToPublic(json: string): Promise<void> {
  try {
    const safUri = await getSafUri();
    if (!safUri) return;

    const files = await StorageAccessFramework.readDirectoryAsync(safUri);
    const existing = files.find(
      (f: string) => f.includes('weapons.json') || f.includes('weapons%2Ejson') || f.endsWith('%3Aweapons.json')
    );

    if (existing) {
      await StorageAccessFramework.writeAsStringAsync(existing, json);
    } else {
      const fileUri = await StorageAccessFramework.createFileAsync(
        safUri,
        'weapons',
        'application/json'
      );
      await StorageAccessFramework.writeAsStringAsync(fileUri, json);
    }
  } catch {
    // best-effort, never block main write
  }
}

export async function readWeapons(): Promise<Weapon[]> {
  await ensureInternal();
  const raw = await FileSystem.readAsStringAsync(getInternalFile());
  try {
    return JSON.parse(raw) as Weapon[];
  } catch {
    return [];
  }
}

export async function writeWeapons(weapons: Weapon[]): Promise<void> {
  const json = JSON.stringify(weapons, null, 2);
  try {
    await FileSystem.writeAsStringAsync(getInternalFile(), json);
  } catch (e) {
    console.error('[jsonStorage] writeAsStringAsync failed:', e);
    throw e;
  }
  syncToPublic(json); // fire-and-forget, не блокуємо
}

export function getFilePath(): string {
  return (FileSystem.documentDirectory ?? '') + 'weapons.json';
}
