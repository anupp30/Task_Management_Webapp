import { BrowserRouter } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { FilterBar } from './components/FilterBar';
import { useStore } from './store/useStore';
import { KanbanView } from './views/KanbanView';
import { ListView } from './views/ListView';
import { TimelineView } from './views/TimelineView';
import { CollaborationOverlay } from './components/CollaborationOverlay';
import { useCollaboration } from './hooks/useCollaboration';
import { useURLSync } from './hooks/useURLSync';

function AppContent() {
  const { activeView } = useStore();
  
  // Start simulation
  useCollaboration();
  
  // Sync URL to Store and vice versa
  useURLSync();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <FilterBar />
      <CollaborationOverlay />
      
      <main className="flex-1 overflow-hidden flex flex-col pt-4 px-6 md:px-8 max-w-[100rem] mx-auto w-full relative">
        {activeView === 'kanban' && <KanbanView />}
        {activeView === 'list' && <ListView />}
        {activeView === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
