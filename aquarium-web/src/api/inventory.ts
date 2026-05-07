import api from './auth';

export interface UserInventoryItem {
  id: number;
  itemType: 'FISH' | 'DECORATION';
  itemId: number;
  acquiredAt: string;
}

export const inventoryApi = {
  getMyInventory: () => api.get<UserInventoryItem[]>('/inventory/me'),
};
