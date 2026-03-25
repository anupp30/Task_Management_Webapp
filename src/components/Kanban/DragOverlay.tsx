import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { TaskCard } from './TaskCard';
import type { Status } from '../../types';

export const DragOverlay = () => {
  const { draggedTaskId, setDraggedTaskId, updateTaskStatus, tasks, setHoveredColumn, hoveredColumn } = useStore();
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const draggedTask = tasks.find(t => t.id === draggedTaskId);

  useEffect(() => {
    if (!draggedTaskId) return;

    const handlePointerMove = (e: PointerEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Hit testing for columns
      // Hide the dragged element briefly to get the element underneath
      const dropTargets = document.elementsFromPoint(e.clientX, e.clientY);
      const columnEl = dropTargets.find(el => el.hasAttribute('data-column-status'));
      
      if (columnEl) {
        const status = columnEl.getAttribute('data-column-status') as Status;
        setHoveredColumn(status);
      } else {
        setHoveredColumn(null);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      e.preventDefault();
      
      // Perform drop
      if (hoveredColumn && draggedTask && hoveredColumn !== draggedTask.status) {
        updateTaskStatus(draggedTaskId, hoveredColumn);
      }
      
      // Reset
      setDraggedTaskId(null);
      setHoveredColumn(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedTaskId, hoveredColumn, draggedTask, setDraggedTaskId, updateTaskStatus, setHoveredColumn]);

  if (!draggedTask) return null;

  return (
    <div 
      className="fixed pointer-events-none z-50 transition-none shadow-2xl opacity-90 scale-105"
      style={{
         left: position.x,
         top: position.y,
         // center to the cursor
         transform: 'translate(-50%, -50%)',
         width: '280px'
      }}
    >
      <TaskCard task={draggedTask} isClone />
    </div>
  );
};
