import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getInitials } from '../utils/helpers';

export const CollaborationOverlay = () => {
  const { presenceUsers } = useStore();
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; visible: boolean; stackIndex: number }>>({});

  useEffect(() => {
    let animationFrameId: number;

    const updatePositions = () => {
      const newPositions: typeof positions = {};
      
      const usersByTask: Record<string, typeof presenceUsers> = {};
      presenceUsers.forEach(u => {
        if (u.currentTaskId) {
          if (!usersByTask[u.currentTaskId]) usersByTask[u.currentTaskId] = [];
          usersByTask[u.currentTaskId].push(u);
        }
      });

      presenceUsers.forEach(user => {
        if (!user.currentTaskId) {
          newPositions[user.id] = { x: 0, y: 0, visible: false, stackIndex: 0 };
          return;
        }

        const el = document.querySelector(`[data-task-id="${user.currentTaskId}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const taskUsers = usersByTask[user.currentTaskId] || [];
          const index = taskUsers.findIndex(u => u.id === user.id);
          
          newPositions[user.id] = {
            x: rect.right - 28 - (index * 14) - 8,
            y: rect.top - 12, // Above upper right corner
            visible: true,
            stackIndex: index
          };
        } else {
          newPositions[user.id] = { x: 0, y: 0, visible: false, stackIndex: 0 };
        }
      });
      
      setPositions(newPositions);
    };

    updatePositions();
    
    const tick = () => {
      updatePositions();
      animationFrameId = requestAnimationFrame(tick);
    };
    
    // Use requestAnimationFrame for smooth continuous tracking during scroll
    tick();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [presenceUsers]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {presenceUsers.map(user => {
        const pos = positions[user.id] || { x: 0, y: 0, visible: false, stackIndex: 0 };
        
        return (
          <div
            key={user.id}
            className="absolute w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ring-2 ring-white origin-bottom-right"
            style={{
              backgroundColor: user.color,
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.visible ? 1 : 0.5})`,
              opacity: pos.visible ? 1 : 0,
              zIndex: 100 - pos.stackIndex
            }}
            title={user.name}
          >
            {getInitials(user.name)}
          </div>
        );
      })}
    </div>
  );
};
