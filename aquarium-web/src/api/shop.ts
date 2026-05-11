import api from './auth';

export const shopApi = {
  purchaseFish: (fishId: number) => api.post<{ message: string }>(`/shop/purchase/${fishId}`),
};
