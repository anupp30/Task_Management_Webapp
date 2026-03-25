import type { Status } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { DragOverlay } from './DragOverlay';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';

const COLUMNS: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export const KanbanBoard = () => {
  const tasks = useFilteredTasks();

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4 h-full snap-x relative items-start">
      <DragOverlay />
      {COLUMNS.map(status => {
        const columnTasks = tasks.filter(t => t.status === status);
        return (
          <KanbanColumn 
            key={status} 
            status={status} 
            tasks={columnTasks} 
          />
        );
      })}
    </div>
  );
};
