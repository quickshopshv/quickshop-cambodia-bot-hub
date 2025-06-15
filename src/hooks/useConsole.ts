
import { create } from 'zustand';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: string;
}

interface ConsoleStore {
  logs: LogEntry[];
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
}

export const useConsole = create<ConsoleStore>((set) => ({
  logs: [],
  addLog: (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp
    };
    
    set((state) => ({
      logs: [...state.logs, newLog].slice(-100) // Keep only last 100 logs
    }));
  },
  clearLogs: () => set({ logs: [] })
}));
