import { create } from 'zustand';
import type { Task, Filters, ViewMode, Status } from '../types';
import { generateTasks } from '../data/generator';

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
  currentTaskId: string | null;
}

interface AppState {
  tasks: Task[];
  filters: Filters;
  activeView: ViewMode;
  
  // Drag and Drop state
  draggedTaskId: string | null;
  hoveredColumn: Status | null;

  // Collaboration state
  presenceUsers: PresenceUser[];
  
  updateTaskStatus: (taskId: string, newStatus: Status) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setView: (view: ViewMode) => void;
  
  setDraggedTaskId: (id: string | null) => void;
  setHoveredColumn: (status: Status | null) => void;
  updatePresenceUser: (userId: string, taskId: string | null) => void;
}

const initialTasks = generateTasks(500);

const MOCK_PRESENCE_USERS: PresenceUser[] = [
  { id: 'p1', name: 'Alice', color: '#EF4444', currentTaskId: null },
  { id: 'p2', name: 'Bob', color: '#3B82F6', currentTaskId: null },
  { id: 'p3', name: 'Charlie', color: '#10B981', currentTaskId: null },
  { id: 'p4', name: 'Diana', color: '#F59E0B', currentTaskId: null }
];

export const useStore = create<AppState>((set) => ({
  tasks: initialTasks,
  filters: {
    status: [],
    priority: [],
    assignees: [],
    dateRange: { start: null, end: null }
  },
  activeView: 'kanban',
  draggedTaskId: null,
  hoveredColumn: null,
  presenceUsers: MOCK_PRESENCE_USERS,

  updateTaskStatus: (taskId, newStatus) => 

    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    })),
    
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    })),
    
  setFilters: (newFilters) => 
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),
    
  setView: (view) => set({ activeView: view }),
  setDraggedTaskId: (id) => set({ draggedTaskId: id }),
  setHoveredColumn: (status) => set({ hoveredColumn: status }),
  updatePresenceUser: (userId, taskId) =>
    set((state) => ({
      presenceUsers: state.presenceUsers.map(u => u.id === userId ? { ...u, currentTaskId: taskId } : u)
    }))
}));
