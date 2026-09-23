import { create } from 'zustand';
import { initialDrivers } from '../data/mockData';
import { Driver } from '../types';

type CooperativeState = {
  drivers: Driver[];
  addDriver: (name: string, phone: string) => void;
  toggleDriverStatus: (id: string) => void;
};

export const useCooperativeStore = create<CooperativeState>((set) => ({
  drivers: initialDrivers,
  addDriver: (name, phone) => set((state) => ({
    drivers: [...state.drivers, { id: String(Date.now()), name, phone, status: 'Disponible' }],
  })),
  toggleDriverStatus: (id) => set((state) => ({
    drivers: state.drivers.map((driver) => driver.id === id
      ? {
          ...driver,
          status: driver.status === 'Disponible'
            ? 'En viaje'
            : driver.status === 'En viaje'
              ? 'Descanso'
              : 'Disponible'
        }
      : driver),
  })),

}));
