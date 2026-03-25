import type { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

type Props = {
  status: Status;
  tasks: Task[];
};

export const KanbanColumn = ({ status, tasks }: Props) => {
  const { hoveredColumn } = useStore();
  const isHovered = hoveredColumn === status;

  return (
    <div 
      data-column-status={status}
      className={clsx(
        "flex flex-col bg-gray-100/50 rounded-xl w-80 min-w-[20rem] max-h-full overflow-hidden border shadow-sm flex-shrink-0 transition-all duration-200",
        isHovered ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-400/20" : "border-gray-200/60"
      )}
    >
      <div className={clsx(
        "px-4 py-3 border-b flex justify-between items-center sticky top-0 transition-colors",
        isHovered ? "bg-blue-100/50 border-blue-200" : "bg-gray-100/80 border-gray-200/80"
      )}>
        <h3 className="font-semibold text-gray-700 text-sm tracking-wide pointer-events-none">{status}</h3>
        <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2.5 rounded-full font-medium shadow-inner pointer-events-none">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar pointer-events-none">
        {tasks.length === 0 ? (
          <div className="h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-500 bg-gray-50/50">
            No tasks yet
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="pointer-events-auto">
              <TaskCard task={task} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
