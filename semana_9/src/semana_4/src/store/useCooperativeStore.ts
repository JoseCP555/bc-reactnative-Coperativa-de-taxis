import { create } from 'zustand';
import { initialDrivers } from '../../../semana_2/src/data/mockData';
import type { Driver } from '../../../semana_2/src/types';
import { readDriverCache, writeDriverCache } from '../../../semana_7/src/storage/driverCache';

type CooperativeState = {
  drivers: Driver[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  replaceDrivers: (drivers: Driver[]) => Promise<void>;
  addDriver: (name: string, phone: string) => Promise<Driver>;
  updateDriver: (id: string, name: string, phone: string) => Promise<Driver | null>;
  removeDriver: (id: string) => Promise<void>;
  toggleDriverStatus: (id: string) => Promise<void>;
};

export const useCooperativeStore = create<CooperativeState>((set, get) => ({
  drivers: initialDrivers,
  hydrated: false,
  hydrate: async () => {
    const cached = await readDriverCache();
    if (cached) set({ drivers: cached });
    set({ hydrated: true });
  },
  replaceDrivers: async (drivers) => {
    set({ drivers });
    await writeDriverCache(drivers);
  },
  addDriver: async (name, phone) => {
    const driver: Driver = { id: `d${Date.now()}`, name, phone, status: 'Disponible' };
    const drivers = [driver, ...get().drivers];
    set({ drivers });
    await writeDriverCache(drivers);
    return driver;
  },
  updateDriver: async (id, name, phone) => {
    const current = get().drivers.find((driver) => driver.id === id);
    if (!current) return null;
    const drivers = get().drivers.map((driver) => driver.id === id ? { ...driver, name, phone } : driver);
    set({ drivers });
    await writeDriverCache(drivers);
    return drivers.find((driver) => driver.id === id) ?? null;
  },
  removeDriver: async (id) => {
    const drivers = get().drivers.filter((driver) => driver.id !== id);
    set({ drivers });
    await writeDriverCache(drivers);
  },
  toggleDriverStatus: async (id) => {
    const drivers = get().drivers.map((driver) => {
      if (driver.id !== id) return driver;
      const status: Driver['status'] = driver.status === 'Disponible' ? 'En viaje' : driver.status === 'En viaje' ? 'Descanso' : 'Disponible';
      return { ...driver, status };
    });
    set({ drivers });
    await writeDriverCache(drivers);
  },
}));
