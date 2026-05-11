import { create } from 'zustand';
import type {  DecorationSpecies } from '../api/decoration';
import { decorationApi } from '../api/decoration';  

interface DecorationState {
  decorations: DecorationSpecies[];
  loadingDecorations: boolean;
  fetchDecorations: () => Promise<void>;
}

export const useDecorationStore = create<DecorationState>((set) => ({
  decorations: [],
  loadingDecorations: false,

  fetchDecorations: async () => {
    set({ loadingDecorations: true });
    try {
      const res = await decorationApi.getAllDecorations();
      set({ decorations: res.data });
    } catch (err) {
      console.error('Failed to fetch decorations', err);
    } finally {
      set({ loadingDecorations: false });
    }
  },
}));
