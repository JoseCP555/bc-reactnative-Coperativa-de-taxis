import { create } from 'zustand';
import { preferencesStorage } from '../storage/preferencesStorage';

export type SortOrder = 'name' | 'status';
type PreferencesState = {
  sortOrder: SortOrder;
  compactMode: boolean;
  itemsPerPage: number;
  hydrate: () => void;
  setSortOrder: (value: SortOrder) => void;
  setCompactMode: (value: boolean) => void;
  setItemsPerPage: (value: number) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  sortOrder: 'name', compactMode: false, itemsPerPage: 10,
  hydrate: () => {
    const order = preferencesStorage.getString('sortOrder');
    const compact = preferencesStorage.getBoolean('compactMode');
    const pageSize = preferencesStorage.getNumber('itemsPerPage');
    set({ sortOrder: order === 'status' ? 'status' : 'name', compactMode: compact ?? false, itemsPerPage: pageSize && [5, 10, 20].includes(pageSize) ? pageSize : 10 });
  },
  setSortOrder: (sortOrder) => { preferencesStorage.setString('sortOrder', sortOrder); set({ sortOrder }); },
  setCompactMode: (compactMode) => { preferencesStorage.setBoolean('compactMode', compactMode); set({ compactMode }); },
  setItemsPerPage: (itemsPerPage) => { preferencesStorage.setNumber('itemsPerPage', itemsPerPage); set({ itemsPerPage }); },
}));
