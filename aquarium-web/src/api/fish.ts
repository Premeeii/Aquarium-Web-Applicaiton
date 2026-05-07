import api from './auth';

export interface FishSpecies {
  id: number;
  speciesName: string;
  description: string;
  basePrice: number;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';
  imageUrlEgg: string;
  imageUrlBaby: string;
  imageUrlAdult: string;
}

export const fishApi = {
  getAllFishes: () => api.get<FishSpecies[]>('/fishes'),
};
