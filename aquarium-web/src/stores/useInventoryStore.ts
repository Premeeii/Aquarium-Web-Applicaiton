import { create } from 'zustand';
import { inventoryApi } from '../api/inventory';
import type { UserInventoryItem } from '../api/inventory';


interface InventoryState {
  inventory: UserInventoryItem[];
  loadingInventory: boolean;
  isInventoryOpen: boolean;

  fetchInventory: () => Promise<void>;
  ensureLoaded: () => Promise<void>;
  openInventory: () => void;
  closeInventory: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: [],
  loadingInventory: false,
  isInventoryOpen: false,

  fetchInventory: async () => {
    set({ loadingInventory: true });
    try {
      const res = await inventoryApi.getMyInventory();
      set({ inventory: res.data, isInventoryOpen: true });
    } catch (err) {
      console.error('Failed to fetch inventory', err);
      alert('Could not load inventory');
    } finally {
      set({ loadingInventory: false });
    }
  },

  ensureLoaded: async () => {
    if (get().inventory.length === 0) {
      try {
        const res = await inventoryApi.getMyInventory();
        set({ inventory: res.data });
      } catch (err) {
        console.error('Failed to preload inventory', err);
      }
    }
  },

  openInventory: () => set({ isInventoryOpen: true }),
  closeInventory: () => set({ isInventoryOpen: false }),
}));
