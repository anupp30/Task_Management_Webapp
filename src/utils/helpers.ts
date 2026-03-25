import { isToday, isPast, differenceInDays } from 'date-fns';

export const formatDueDate = (date: Date): { text: string; isOverdue: boolean; isToday: boolean } => {
  const normalizedDate = new Date(date);
  const today = isToday(normalizedDate);
  
  if (today) {
    return { text: "Due Today", isOverdue: false, isToday: true };
  }
  
  const overdue = isPast(normalizedDate) && !today;
  const daysOverdue = overdue ? differenceInDays(new Date(), normalizedDate) : 0;
  
  let text = normalizedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (overdue && daysOverdue > 7) {
    text = `${daysOverdue} days overdue`;
  }
  
  return { 
    text, 
    isOverdue: overdue, 
    isToday: false 
  };
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};
