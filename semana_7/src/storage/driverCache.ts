import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Driver } from '../../../semana_2/src/types';

const DRIVER_CACHE_KEY = 'cooperativa-drivers-cache-v1';

export async function readDriverCache(): Promise<Driver[] | null> {
  const raw = await AsyncStorage.getItem(DRIVER_CACHE_KEY);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return null;
    return value as Driver[];
  } catch {
    await AsyncStorage.removeItem(DRIVER_CACHE_KEY);
    return null;
  }
}

export async function writeDriverCache(drivers: Driver[]): Promise<void> {
  await AsyncStorage.setItem(DRIVER_CACHE_KEY, JSON.stringify(drivers));
}
