import { useStore } from '../store/useStore';
import { startOfDay } from 'date-fns';

export function useFilteredTasks() {
  const { tasks, filters } = useStore();
  
  return tasks.filter(task => {
    if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
    if (filters.assignees.length > 0 && !filters.assignees.includes(task.assignee)) return false;
    
    if (filters.dateRange.start || filters.dateRange.end) {
      const taskDate = startOfDay(new Date(task.dueDate));
      if (filters.dateRange.start && taskDate < startOfDay(new Date(filters.dateRange.start))) return false;
      if (filters.dateRange.end && taskDate > startOfDay(new Date(filters.dateRange.end))) return false;
    }
    
    return true;
  });
}
