import api from './auth';
import type { FishSpecies } from './fish';

export interface UserInventoryItem {
  id: number;
  itemType: 'FISH' | 'DECORATION';
  itemId: number;
  fishDetails?: FishSpecies;
  acquiredAt: string;
}

export const inventoryApi = {
  getMyInventory: () => api.get<UserInventoryItem[]>('/inventory/me'),
};
