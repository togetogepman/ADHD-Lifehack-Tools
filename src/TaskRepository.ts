import { Task, NewTask } from './types';

// Defines the contract for task data operations.
export interface ITaskRepository {
  getTasks(): Promise<Task[]>;
  addTask(task: NewTask): Promise<Task>;
  incrementPomodoro(taskId: string): Promise<void>;
}

// Implements the repository pattern using fetch to interact with the Google Apps Script API.
export class SheetsRepository implements ITaskRepository {
  private baseUrl = import.meta.env.VITE_API_BASE;

  constructor() {
    if (!this.baseUrl) {
      throw new Error("VITE_API_BASE environment variable is not set.");
    }
  }

  async getTasks(): Promise<Task[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }

  async addTask(task: NewTask): Promise<Task> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script quirk
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to add task');
    }
    return response.json();
  }

  async incrementPomodoro(taskId: string): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script quirk
      },
      body: JSON.stringify({ taskId }),
    });
    if (!response.ok) {
      throw new Error('Failed to increment pomodoro count');
    }
    // We don't need the response body, just confirmation of success.
  }
}

export const taskRepository = new SheetsRepository();
