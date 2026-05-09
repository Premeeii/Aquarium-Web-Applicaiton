import { create } from 'zustand';
import type { TaskResponse } from '../api/task';

interface TimerState {
  activeTask: TaskResponse | null;
  targetEndTime: number | null;
  timeLeft: number; // in seconds
  status: 'IDLE' | 'RUNNING' | 'PAUSED';
  originalDuration: number; // in minutes
  pausedAt: number | null; // Timestamp when paused

  startTimer: (task: TaskResponse) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  syncFromStorage: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => {
  // Try to load initial state from localStorage
  const loadState = () => {
    try {
      const stored = localStorage.getItem('timerState');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load timer state', e);
    }
    return null;
  };

  const initialState = loadState() || {
    activeTask: null,
    targetEndTime: null,
    timeLeft: 0,
    status: 'IDLE',
    originalDuration: 0,
    pausedAt: null,
  };

  const saveState = (state: Partial<TimerState>) => {
    try {
      const currentState = get();
      const newState = { ...currentState, ...state };
      localStorage.setItem('timerState', JSON.stringify({
        activeTask: newState.activeTask,
        targetEndTime: newState.targetEndTime,
        timeLeft: newState.timeLeft,
        status: newState.status,
        originalDuration: newState.originalDuration,
        pausedAt: newState.pausedAt,
      }));
    } catch (e) {
      console.error('Failed to save timer state', e);
    }
  };

  return {
    ...initialState,

    startTimer: (task) => {
      const now = Date.now();
      const durationMinutes = task.expectedDuration;
      const targetEndTime = now + durationMinutes * 60 * 1000;
      const newState = {
        activeTask: task,
        targetEndTime,
        timeLeft: durationMinutes * 60,
        status: 'RUNNING' as const,
        originalDuration: durationMinutes,
        pausedAt: null,
      };
      set(newState);
      saveState(newState);
    },

    pauseTimer: () => {
      const { status } = get();
      if (status !== 'RUNNING') return;
      const newState = {
        status: 'PAUSED' as const,
        pausedAt: Date.now(),
      };
      set(newState);
      saveState(newState);
    },

    resumeTimer: () => {
      const { status, pausedAt, targetEndTime } = get();
      if (status !== 'PAUSED' || !pausedAt || !targetEndTime) return;
      
      const now = Date.now();
      const timePaused = now - pausedAt;
      const newTargetEndTime = targetEndTime + timePaused;
      
      const newState = {
        status: 'RUNNING' as const,
        targetEndTime: newTargetEndTime,
        pausedAt: null,
      };
      set(newState);
      saveState(newState);
    },

    stopTimer: () => {
      const newState = {
        activeTask: null,
        targetEndTime: null,
        timeLeft: 0,
        status: 'IDLE' as const,
        originalDuration: 0,
        pausedAt: null,
      };
      set(newState);
      localStorage.removeItem('timerState');
    },

    tick: () => {
      const { status, targetEndTime, timeLeft } = get();
      if (status !== 'RUNNING' || !targetEndTime) return;

      const now = Date.now();
      const newTimeLeft = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      
      if (newTimeLeft !== timeLeft) {
        set({ timeLeft: newTimeLeft });
        
        // If time is up, we stop the timer here (or let the component handle it)
        // Usually, the component will watch `timeLeft` and trigger completion
      }
    },

    syncFromStorage: () => {
      const state = loadState();
      if (state) {
        set(state);
      }
    }
  };
});
