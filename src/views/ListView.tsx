import { useState, useRef, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatDueDate } from '../utils/helpers';
import clsx from 'clsx';
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { useVirtualScroll } from '../hooks/useVirtualScroll';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import type { Status } from '../types';

type SortConfig = { key: 'title' | 'priority' | 'dueDate' | null; direction: 'asc' | 'desc' };

const priorityValue = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const ALL_STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const ROW_HEIGHT = 56;

export const ListView = () => {
  const { updateTaskStatus, setFilters } = useStore();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // 1. Filter tasks
  const filteredTasks = useFilteredTasks(); 

  // 2. Sort tasks
  const sortedTasks = useMemo(() => {
    if (!sortConfig.key) return filteredTasks;
    return [...filteredTasks].sort((a, b) => {
      let result = 0;
      if (sortConfig.key === 'title') {
        result = a.title.localeCompare(b.title);
      } else if (sortConfig.key === 'priority') {
        result = priorityValue[a.priority] - priorityValue[b.priority];
      } else if (sortConfig.key === 'dueDate') {
        result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [filteredTasks, sortConfig]);

  // 3. Virtual Scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const { startIndex, endIndex, totalHeight, offsetY } = useVirtualScroll(
    containerRef,
    sortedTasks.length,
    ROW_HEIGHT,
    5
  );

  const visibleTasks = sortedTasks.slice(startIndex, endIndex);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: SortConfig['key'] }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-blue-600" /> : <ArrowDown size={14} className="text-blue-600" />;
  };

  if (sortedTasks.length === 0) {
     return (
       <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 h-full shadow-sm">
         <p className="text-gray-500 mb-4">No tasks found matching your criteria.</p>
         <button 
           onClick={() => setFilters({ status: [], priority: [], assignees: [], dateRange: { start: null, end: null } })} 
           className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
         >
           Clear Filters
         </button>
       </div>
     );
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3.5 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-10 w-full min-w-[600px]">
        <div className="flex items-center space-x-2 cursor-pointer select-none hover:text-gray-700 transition-colors" onClick={() => handleSort('title')}>
          <span>Title</span> <SortIcon columnKey="title" />
        </div>
        <div className="flex items-center space-x-2 cursor-pointer select-none hover:text-gray-700 transition-colors" onClick={() => handleSort('priority')}>
          <span>Priority</span> <SortIcon columnKey="priority" />
        </div>
        <div className="flex items-center space-x-2 cursor-pointer select-none hover:text-gray-700 transition-colors" onClick={() => handleSort('dueDate')}>
          <span>Due Date</span> <SortIcon columnKey="dueDate" />
        </div>
        <div>Status</div>
      </div>

      {/* Virtual Scroll Container */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-auto custom-scrollbar relative w-full min-w-[600px]"
      >
        <div style={{ height: `${totalHeight}px`, width: '100%' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }} className="will-change-transform w-full absolute top-0 left-0">
            {visibleTasks.map(task => {
              const { text, isOverdue } = formatDueDate(task.dueDate);
              return (
                <div 
                  key={task.id} 
                  data-task-id={task.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 items-center border-b border-gray-100 hover:bg-gray-50/80 transition-colors w-full group"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  <div className="font-medium text-gray-900 truncate pr-4" title={task.title}>
                    {task.title}
                  </div>
                  <div>
                    <span className={clsx("text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border", {
                       'bg-red-50 text-red-700 border-red-200': task.priority === 'Critical',
                       'bg-orange-50 text-orange-700 border-orange-200': task.priority === 'High',
                       'bg-yellow-50 text-yellow-700 border-yellow-200': task.priority === 'Medium',
                       'bg-blue-50 text-blue-700 border-blue-200': task.priority === 'Low',
                    })}>
                      {task.priority}
                    </span>
                  </div>
                  <div className={clsx("text-sm", isOverdue ? "text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded ml-[-8px] w-fit" : "text-gray-600")}>
                    {text}
                  </div>
                  <div className="pr-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                      className="text-sm border border-gray-300 rounded-md py-1.5 px-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer w-full shadow-sm hover:border-gray-400 outline-none transition-colors"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
