import api from './auth';

export interface LayoutItemRequest {
  id: string;
  instanceType: "FISH" | "DECORATION";
  instanceId: number;
  posX: number;
  posY: number;
}

export interface AquariumLayoutRequest {
  items: LayoutItemRequest[];
}

export interface AquariumLayoutResponse {
  id: number;
  frontendId: string;
  instanceType: "FISH" | "DECORATION";
  instanceId: number;
  posX: number;
  posY: number;
}

export const layoutApi = {
  getLayout: () => api.get<AquariumLayoutResponse[]>('/layout'),
  saveLayout: (data: AquariumLayoutRequest) => api.post<AquariumLayoutResponse[]>('/layout', data),
  deleteLayoutItem: (id: number) => api.delete(`/layout/${id}`),
};
