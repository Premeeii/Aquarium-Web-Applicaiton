import api from './auth';
import type { FishSpecies } from './fish';
import type { DecorationSpecies } from './decoration';

export interface UserInventoryItem {
  id: number;
  itemType: 'FISH' | 'DECORATION';
  itemId: number;
  fishDetails?: FishSpecies;
  decorationDetails?: DecorationSpecies;
  acquiredAt: string;
}

export const inventoryApi = {
  getMyInventory: () => api.get<UserInventoryItem[]>('/inventory/me'),
};
