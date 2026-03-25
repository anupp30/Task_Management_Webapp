import type { Task } from '../../types';
import { getInitials, formatDueDate } from '../../utils/helpers';
import { MOCK_USERS } from '../../data/generator';
import clsx from 'clsx';
import { Calendar, User as UserIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';

const priorityColors = {
  Low: 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/20',
  Medium: 'bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-600/20',
  High: 'bg-orange-100 text-orange-700 ring-1 ring-inset ring-orange-600/20',
  Critical: 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20',
};

export const TaskCard = ({ task, isClone }: { task: Task; isClone?: boolean }) => {
  const assignee = MOCK_USERS.find(u => u.id === task.assignee);
  const { text: dateText, isOverdue, isToday } = formatDueDate(task.dueDate);
  const { draggedTaskId, setDraggedTaskId } = useStore();
  
  const isDragging = draggedTaskId === task.id && !isClone;

  return (
    <div 
      data-task-id={task.id}
      onPointerDown={(e) => {
        if (e.button !== 0) return; // React to left click only
        e.preventDefault();
        setDraggedTaskId(task.id);
      }}
      className={clsx(
        "p-3.5 rounded-lg border transition-all group relative overflow-hidden select-none",
        isClone 
          ? "cursor-grabbing ring-2 ring-blue-500 shadow-2xl rotate-2 bg-white border-blue-200" 
          : "hover:shadow-md cursor-grab active:cursor-grabbing bg-white border-gray-200 shadow-sm",
        isDragging && "opacity-40 border-dashed bg-gray-50 shadow-none grayscale-[50%]"
      )}
    >
      <div className="flex justify-between items-start mb-2 pointer-events-none">
        <span className={clsx("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full pointer-events-none", priorityColors[task.priority])}>
          {task.priority}
        </span>
        <div className="flex items-center space-x-1 pointer-events-none">
           <div 
             className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm"
             style={{ backgroundColor: assignee?.color || '#cbd5e1' }}
             title={assignee?.name}
           >
             {assignee ? getInitials(assignee.name) : <UserIcon size={12} />}
           </div>
        </div>
      </div>
      
      <h4 className="text-sm font-medium text-gray-900 mb-3 leading-relaxed pointer-events-none">
        {task.title}
      </h4>
      
      <div className="flex items-center justify-between text-xs text-gray-500 pointer-events-none">
        <div className={clsx(
          "flex items-center space-x-1.5 font-medium px-1.5 py-0.5 rounded-md -ml-1.5",
          isOverdue ? "text-red-600 bg-red-50" : isToday ? "text-orange-600 bg-orange-50" : "hover:bg-gray-50 bg-gray-50/50"
        )}>
          <Calendar size={13} />
          <span>{dateText}</span>
        </div>
        <span className="text-gray-400 font-mono text-[10px]">{task.id}</span>
      </div>
    </div>
  );
};
