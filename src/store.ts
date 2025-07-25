import { create } from 'zustand';
import { Task, NewTask } from './types';
import { taskRepository } from './TaskRepository';

// Defines the state structure and actions for the application.
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  activeTask: Task | null;
  fetchTasks: () => Promise<void>;
  addTask: (newTask: NewTask) => Promise<void>;
  incrementPomodoro: (taskId: string) => Promise<void>;
  setActiveTask: (task: Task | null) => void;
}

// Creates a Zustand store for managing task-related state.
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: true,
  error: null,
  activeTask: null,

  // Fetches all tasks from the repository and updates the state.
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskRepository.getTasks();
      set({ tasks, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  // Adds a new task and then re-fetches the list to ensure UI is in sync.
  addTask: async (newTask: NewTask) => {
    try {
      await taskRepository.addTask(newTask);
      await get().fetchTasks(); // Re-fetch to get the updated list
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  // Increments a task's pomodoro count and updates it in the local state.
  incrementPomodoro: async (taskId: string) => {
    try {
      await taskRepository.incrementPomodoro(taskId);
      set(state => ({
        tasks: state.tasks.map(t => 
          t.ID === taskId ? { ...t, SpentPom: t.SpentPom + 1 } : t
        ),
        activeTask: state.activeTask?.ID === taskId 
          ? { ...state.activeTask, SpentPom: state.activeTask.SpentPom + 1 } 
          : state.activeTask,
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
  
  // Sets the task that the Pomodoro timer will work on.
  setActiveTask: (task: Task | null) => {
    set({ activeTask: task });
  }
}));
