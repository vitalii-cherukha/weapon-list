import * as FileSystem from 'expo-file-system/legacy';
import { Weapon } from '../modules/weapon/types';

const { StorageAccessFramework } = FileSystem;

// Internal app storage — always writable, source of truth
const INTERNAL_FILE = FileSystem.documentDirectory! + 'weapons.json';

// SAF URI stored after user picks folder once
const SAF_URI_KEY = FileSystem.documentDirectory! + '.saf_uri';

async function ensureInternal(): Promise<void> {
  const info = await FileSystem.getInfoAsync(INTERNAL_FILE);
  if (!info.exists) {
    await FileSystem.writeAsStringAsync(INTERNAL_FILE, JSON.stringify([], null, 2));
  }
}

async function getSafUri(): Promise<string | null> {
  const info = await FileSystem.getInfoAsync(SAF_URI_KEY);
  if (!info.exists) return null;
  return FileSystem.readAsStringAsync(SAF_URI_KEY);
}

// Call once on first launch to let user pick Documents folder
export async function requestPublicFolder(): Promise<boolean> {
  try {
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) return false;
    await FileSystem.writeAsStringAsync(SAF_URI_KEY, permissions.directoryUri);
    return true;
  } catch {
    return false;
  }
}

async function syncToPublic(json: string): Promise<void> {
  const safUri = await getSafUri();
  if (!safUri) return;

  try {
    // Find or create weapons.json in the chosen public folder
    const files = await StorageAccessFramework.readDirectoryAsync(safUri);
    const existing = files.find((f: string) => f.endsWith('%3Aweapons.json') || f.endsWith('weapons.json'));

    if (existing) {
      await StorageAccessFramework.writeAsStringAsync(existing, json);
    } else {
      const fileUri = await StorageAccessFramework.createFileAsync(safUri, 'weapons', 'application/json');
      await StorageAccessFramework.writeAsStringAsync(fileUri, json);
    }
  } catch {
    // Public sync is best-effort
  }
}

export async function readWeapons(): Promise<Weapon[]> {
  await ensureInternal();
  const raw = await FileSystem.readAsStringAsync(INTERNAL_FILE);
  return JSON.parse(raw) as Weapon[];
}

export async function writeWeapons(weapons: Weapon[]): Promise<void> {
  const json = JSON.stringify(weapons, null, 2);
  await FileSystem.writeAsStringAsync(INTERNAL_FILE, json);
  await syncToPublic(json);
}

export function getFilePath(): string {
  return INTERNAL_FILE;
}
