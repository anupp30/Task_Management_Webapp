import { KanbanBoard } from '../components/Kanban/KanbanBoard';

export const KanbanView = () => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
};
