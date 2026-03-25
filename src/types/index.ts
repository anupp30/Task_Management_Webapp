export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "To Do" | "In Progress" | "In Review" | "Done";
export type ViewMode = "kanban" | "list" | "timeline";

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string; // user id
  priority: Priority;
  status: Status;
  startDate?: Date;
  dueDate: Date;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignees: string[];
  dateRange: { start: Date | null; end: Date | null };
}
