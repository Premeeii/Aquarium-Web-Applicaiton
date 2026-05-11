import api from './auth';

export interface DecorationSpecies {
  id: number;
  itemName: string;
  category: string;
  price: number;
  imageUrl: string;
}

export const decorationApi = {
  getAllDecorations: () => api.get<DecorationSpecies[]>('/decorations'),
};
