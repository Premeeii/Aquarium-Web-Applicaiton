import { create } from 'zustand';
import { taskApi } from '../api/task';
import type { TaskResponse } from '../api/task';

interface TaskState {
  tasks: TaskResponse[];
  loadingTasks: boolean;
  isTaskModalOpen: boolean;
  isCompleteModalOpen: boolean;
  selectedTask: TaskResponse | null;

  // Create Task Form
  taskTitle: string;
  taskTag: string;
  taskDuration: number;
  selectedFishId: number | null;

  // Complete Task Form
  actualDuration: number;
  completedEarly: boolean;

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: () => Promise<boolean>;
  completeTask: () => Promise<boolean>;
  openTaskModal: () => void;
  closeTaskModal: () => void;
  openCompleteModal: (task: TaskResponse) => void;
  closeCompleteModal: () => void;

  // Form setters
  setTaskTitle: (v: string) => void;
  setTaskTag: (v: string) => void;
  setTaskDuration: (v: number) => void;
  setSelectedFishId: (v: number | null) => void;
  setActualDuration: (v: number) => void;
  setCompletedEarly: (v: boolean) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loadingTasks: false,
  isTaskModalOpen: false,
  isCompleteModalOpen: false,
  selectedTask: null,

  // Create Task Form defaults
  taskTitle: '',
  taskTag: 'Work',
  taskDuration: 25,
  selectedFishId: null,

  // Complete Task Form defaults
  actualDuration: 25,
  completedEarly: false,

  // --- Actions ---

  fetchTasks: async () => {
    set({ loadingTasks: true });
    try {
      const res = await taskApi.getMyTasks();
      set({ tasks: res.data });
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      set({ loadingTasks: false });
    }
  },

  createTask: async () => {
    const { taskTitle, taskTag, taskDuration, selectedFishId } = get();
    try {
      await taskApi.createTask({
        title: taskTitle,
        tag: taskTag,
        expectedDurationMinutes: taskDuration,
        inventoryFishId: selectedFishId,
      });
      set({ isTaskModalOpen: false, taskTitle: '' });
      get().fetchTasks();
      return true;
    } catch (err) {
      alert('Failed to create task');
      return false;
    }
  },

  completeTask: async () => {
    const { selectedTask, actualDuration, completedEarly } = get();
    if (!selectedTask) return false;
    try {
      await taskApi.completeTask(selectedTask.id, {
        actualDurationMinutes: actualDuration,
        completedEarly,
      });
      set({ isCompleteModalOpen: false, selectedTask: null });
      get().fetchTasks();
      return true;
    } catch (err) {
      alert('Failed to complete task');
      return false;
    }
  },

  openTaskModal: () => set({ isTaskModalOpen: true }),
  closeTaskModal: () => set({ isTaskModalOpen: false }),

  openCompleteModal: (task) =>
    set({
      selectedTask: task,
      actualDuration: task.expectedDuration,
      isCompleteModalOpen: true,
    }),

  closeCompleteModal: () =>
    set({ isCompleteModalOpen: false, selectedTask: null }),

  // --- Form setters ---
  setTaskTitle: (v) => set({ taskTitle: v }),
  setTaskTag: (v) => set({ taskTag: v }),
  setTaskDuration: (v) => set({ taskDuration: v }),
  setSelectedFishId: (v) => set({ selectedFishId: v }),
  setActualDuration: (v) => set({ actualDuration: v }),
  setCompletedEarly: (v) => set({ completedEarly: v }),
}));
