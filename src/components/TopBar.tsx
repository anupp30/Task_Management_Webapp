import { LayoutDashboard, List as ListIcon, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { ViewMode } from '../types';

export const TopBar = () => {
  const { activeView, setView, presenceUsers } = useStore();

  const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'kanban', label: 'Kanban', icon: <LayoutDashboard size={18} /> },
    { id: 'list', label: 'List', icon: <ListIcon size={18} /> },
    { id: 'timeline', label: 'Timeline', icon: <Calendar size={18} /> }
  ];

  const activeUsers = presenceUsers.filter(u => u.currentTaskId);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">ProjectTracker</h1>
        
        <nav className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setView(view.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeView === view.id
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              {view.icon}
              <span>{view.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {activeUsers.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-500">{activeUsers.length} online</span>
            <div className="flex -space-x-2">
              {activeUsers.map(user => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
