import api from './auth';

export interface TaskResponse {
  id: number;
  title: string;
  tag: string;
  expectedDuration: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  inventoryFishId?: number;
  fishDetails?: {
    id: number;
    speciesName: string;
    description: string;
    basePrice: number;
    rarity: string;
    imageUrlEgg: string;
    imageUrlBaby: string;
    imageUrlAdult: string;
  };
}

export interface TaskCreateRequest {
  title: string;
  tag: string;
  expectedDurationMinutes: number;
  inventoryFishId?: number | null;
}

export interface TaskCompleteRequest {
  actualDurationMinutes: number;
  completedEarly: boolean;
}

export interface TaskCompleteResponse {
  taskId: number;
  status: string;
  coinsEarned: number;
  fishUpdate?: {
    instanceId: number;
    growthStage: string;
    growthProgress: number;
  };
}

export const taskApi = {
  getMyTasks: () => api.get<TaskResponse[]>('/tasks/me'),
  createTask: (data: TaskCreateRequest) => api.post<TaskResponse>('/tasks', data),
  completeTask: (taskId: number, data: TaskCompleteRequest) => 
    api.put<TaskCompleteResponse>(`/tasks/${taskId}/complete`, data),
  cancelTask: (taskId: number) =>
    api.put<void>(`/tasks/${taskId}/cancel`),
};
