import { create } from 'zustand';

export interface AquariumItem {
  id: string; // Could be a combination of type and DB id
  type: "decoration" | "fish";
  x: number; // 0-100%
  y: number; // 0-100%
  zIndex: number;
  flipX?: boolean;
  imageUrl: string;
}

interface AquariumState {
  layoutItems: AquariumItem[];
  isEditMode: boolean;
  loading: boolean;
  
  setEditMode: (isEdit: boolean) => void;
  updateItemPosition: (id: string, x: number, y: number) => void;
  addItem: (item: AquariumItem) => void;
  removeItem: (id: string) => void;
  fetchLayout: (inventory: any[]) => Promise<void>;
  saveLayout: () => Promise<void>;
}

export const useAquariumStore = create<AquariumState>((set, get) => ({
  layoutItems: [],
  isEditMode: false,
  loading: false,

  setEditMode: (isEdit) => set({ isEditMode: isEdit }),
  
  updateItemPosition: (id, x, y) => set((state) => ({
    layoutItems: state.layoutItems.map(item => 
      item.id === id ? { ...item, x, y } : item
    )
  })),

  addItem: (item) => set((state) => ({
    // Prevent duplicates by ID
    layoutItems: state.layoutItems.find(i => i.id === item.id) 
      ? state.layoutItems 
      : [...state.layoutItems, item]
  })),

  removeItem: (id) => set((state) => ({
    layoutItems: state.layoutItems.filter(item => item.id !== id)
  })),

  fetchLayout: async (inventory: any[]) => {
    set({ loading: true });
    try {
      const { layoutApi } = await import('../api/layout');
      const res = await layoutApi.getLayout();
      
      const items: AquariumItem[] = res.data.map(dbItem => {
        // Find in inventory to get image
        const invItem = inventory.find(i => i.id === dbItem.instanceId);
        let imageUrl = '';
        if (invItem) {
          if (invItem.itemType === 'DECORATION') {
            imageUrl = invItem.decorationDetails?.imageUrl || '';
          } else {
            imageUrl = invItem.fishDetails?.imageUrlAdult || '';
          }
        }
        
        return {
          id: dbItem.frontendId,
          type: dbItem.instanceType === 'FISH' ? 'fish' : 'decoration',
          x: dbItem.posX,
          y: dbItem.posY,
          zIndex: 20, // default
          imageUrl,
          flipX: false
        };
      });

      set({ layoutItems: items });
    } catch (err) {
      console.error('Failed to fetch layout', err);
    } finally {
      set({ loading: false });
    }
  },

  saveLayout: async () => {
    const { layoutItems } = get();
    try {
      const { layoutApi } = await import('../api/layout');
      await layoutApi.saveLayout({
        items: layoutItems.map(item => ({
          id: item.id,
          instanceType: item.type === 'fish' ? 'FISH' : 'DECORATION',
          instanceId: parseInt(item.id.replace('placed-', '')),
          posX: item.x,
          posY: item.y
        }))
      });
      alert('Layout saved successfully!');
    } catch (err) {
      console.error('Failed to save layout', err);
      alert('Failed to save layout');
    }
  }
}));
