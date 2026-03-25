import type { Task, User, Priority, Status } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', color: '#EF4444' },
  { id: 'u2', name: 'Bob Smith', color: '#3B82F6' },
  { id: 'u3', name: 'Charlie Davis', color: '#10B981' },
  { id: 'u4', name: 'Diana Prince', color: '#F59E0B' },
  { id: 'u5', name: 'Evan Wright', color: '#8B5CF6' },
  { id: 'u6', name: 'Fiona Gallagher', color: '#EC4899' },
];

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const TASK_TITLES = [
  "Update Landing Page", "Fix Navigation Bug", "Refactor API Layer", "Add User Authentication",
  "Design Database Schema", "Implement CI/CD", "Write Unit Tests", "Optimize Images",
  "Migration to v2", "Client Onboarding", "Analytics Dashboard", "SEO Analytics",
  "Update Terms of Service", "Mobile App Support", "Performance Profiling"
];

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateTasks = (count: number = 500): Task[] => {
  const tasks: Task[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const titleBase = TASK_TITLES[Math.floor(Math.random() * TASK_TITLES.length)];
    const id = `TASK-${i + 1}`;
    
    // 80% chance to have a start date
    const hasStartDate = Math.random() > 0.2;
    // Due date mostly in the future, some in the past
    const dueDate = randomDate(
      new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // up to 14 days ago
      new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)  // up to 60 days ahead
    );
    
    let startDate: Date | undefined;
    if (hasStartDate) {
      // Start date before due date
      startDate = randomDate(
        new Date(dueDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        dueDate
      );
    }
    
    tasks.push({
      id,
      title: `${titleBase} - ${id}`,
      assignee: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].id,
      priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      startDate,
      dueDate
    });
  }
  return tasks;
};
