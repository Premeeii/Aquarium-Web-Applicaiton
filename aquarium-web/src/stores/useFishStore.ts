import { create } from 'zustand';
import { fishApi } from '../api/fish';
import type { FishSpecies } from '../api/fish';

interface FishState {
  fishes: FishSpecies[];
  loadingFishes: boolean;
  isModalOpen: boolean;

  fetchFishes: () => Promise<void>;
  openShop: () => void;
  closeShop: () => void;
}

export const useFishStore = create<FishState>((set) => ({
  fishes: [],
  loadingFishes: false,
  isModalOpen: false,

  fetchFishes: async () => {
    set({ loadingFishes: true });
    try {
      const res = await fishApi.getAllFishes();
      set({ fishes: res.data });
    } catch (err) {
      console.error('Failed to fetch fishes', err);
      alert('Could not load fish species');
    } finally {
      set({ loadingFishes: false });
    }
  },

  openShop: () => set({ isModalOpen: true }),
  closeShop: () => set({ isModalOpen: false }),
}));
