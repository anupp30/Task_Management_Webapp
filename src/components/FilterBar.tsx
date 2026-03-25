import { useStore } from '../store/useStore';
import { MOCK_USERS } from '../data/generator';
import type { Status, Priority } from '../types';
import { X } from 'lucide-react';

const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

export const FilterBar = () => {
  const { filters, setFilters } = useStore();
  
  const activeCount = filters.status.length + filters.priority.length + filters.assignees.length + (filters.dateRange.start ? 1 : 0) + (filters.dateRange.end ? 1 : 0);
  
  const toggle = <T,>(arr: T[], item: T) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  return (
    <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-wrap gap-6 items-end shrink-0 z-10 shadow-sm relative">
      
      {/* Status Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
        <div className="flex bg-gray-100/80 rounded-md p-[3px] border border-gray-200 shadow-inner">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilters({ status: toggle(filters.status, s) })}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${filters.status.includes(s) ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Priority</label>
        <div className="flex bg-gray-100/80 rounded-md p-[3px] border border-gray-200 shadow-inner">
          {PRIORITIES.map(p => (
            <button
              key={p}
              onClick={() => setFilters({ priority: toggle(filters.priority, p) })}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all flex items-center gap-1 ${filters.priority.includes(p) ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <div className={`w-2 h-2 rounded-full ${p === 'Critical' ? 'bg-red-500' : p === 'High' ? 'bg-orange-500' : p === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Assignee multi-select (simplified visually) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assignee</label>
        <div className="flex bg-gray-100/80 rounded-md p-[3px] border border-gray-200 shadow-inner max-w-xs overflow-x-auto custom-scrollbar">
          {MOCK_USERS.map(u => (
            <button
               key={u.id}
               onClick={() => setFilters({ assignees: toggle(filters.assignees, u.id) })}
               className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all whitespace-nowrap ${filters.assignees.includes(u.id) ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
               {u.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Due After</label>
        <input 
          type="date" 
          value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
          onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, start: e.target.value ? new Date(e.target.value) : null }})}
          className="text-xs border border-gray-300 rounded-md py-[5px] px-2 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 shadow-sm"
        />
      </div>

      {activeCount > 0 && (
        <button 
          onClick={() => setFilters({ status: [], priority: [], assignees: [], dateRange: { start: null, end: null } })} 
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 px-3 py-2 rounded-md shadow-sm"
        >
          <X size={14} /> 
          Clear Filters ({activeCount})
        </button>
      )}
    </div>
  );
};
