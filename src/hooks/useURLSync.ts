import { useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Status, Priority } from '../types';

export function useURLSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { filters, setFilters } = useStore();
  
  // Track to prevent cyclic updates between url and state
  const isUpdatingUrl = useRef(false);

  // URL --> Store (on mount and back/forward navigation)
  useEffect(() => {
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false;
      return;
    }
    
    const statuses = searchParams.getAll('status') as Status[];
    const priorities = searchParams.getAll('priority') as Priority[];
    const assignees = searchParams.getAll('assignee');
    const startObj = searchParams.get('start');
    const endObj = searchParams.get('end');
    
    setFilters({
      status: statuses,
      priority: priorities,
      assignees: assignees,
      dateRange: {
        start: startObj ? new Date(startObj) : null,
        end: endObj ? new Date(endObj) : null
      }
    });
  // eslint-disable-line react-hooks/exhaustive-deps
  }, [location.search, setFilters]);

  // Store --> URL
  useEffect(() => {
    const newParams = new URLSearchParams();
    filters.status.forEach(s => newParams.append('status', s));
    filters.priority.forEach(p => newParams.append('priority', p));
    filters.assignees.forEach(a => newParams.append('assignee', a));
    
    if (filters.dateRange.start) newParams.set('start', filters.dateRange.start.toISOString());
    if (filters.dateRange.end) newParams.set('end', filters.dateRange.end.toISOString());
    
    const currentSearch = searchParams.toString();
    const newSearch = newParams.toString();
    
    if (currentSearch !== newSearch) {
      isUpdatingUrl.current = true;
      setSearchParams(newParams); // pushes to history
    }
  }, [filters, searchParams, setSearchParams]);
}
