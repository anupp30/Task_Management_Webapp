import { useRef } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, isToday, differenceInDays, startOfDay, format } from 'date-fns';
import { useVirtualScroll } from '../hooks/useVirtualScroll';
import clsx from 'clsx';
import { useFilteredTasks } from '../hooks/useFilteredTasks';

const ROW_HEIGHT = 48;
const DAY_WIDTH = 40;

const barColors = {
  Critical: 'bg-red-500 border-red-600',
  High: 'bg-orange-500 border-orange-600',
  Medium: 'bg-yellow-500 border-yellow-600',
  Low: 'bg-blue-500 border-blue-600'
};

export const TimelineView = () => {
  const tasks = useFilteredTasks();
  
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const visibleTasks = tasks.filter(task => {
    const start = task.startDate ? startOfDay(new Date(task.startDate)) : startOfDay(new Date(task.dueDate));
    const end = startOfDay(new Date(task.dueDate));
    return start <= monthEnd && end >= monthStart;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { startIndex, endIndex, totalHeight, offsetY } = useVirtualScroll(
    containerRef,
    visibleTasks.length,
    ROW_HEIGHT,
    5
  );

  const virtualRenderTasks = visibleTasks.slice(startIndex, endIndex);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
        <div className="w-64 min-w-[16rem] flex-shrink-0 px-4 py-3 font-semibold text-gray-700 text-sm border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 bg-gray-50 flex items-center">
          Task Name
        </div>
        <div className="flex-1 overflow-x-hidden min-w-0">
          <div className="flex h-full">
            {days.map(day => (
              <div 
                key={day.toISOString()} 
                className={clsx(
                  "flex-shrink-0 flex items-center justify-center text-xs border-r border-gray-200",
                  isToday(day) ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-500"
                )}
                style={{ width: DAY_WIDTH }}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="flex-1 overflow-auto custom-scrollbar relative"
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', width: '100%' }}>
            {virtualRenderTasks.map(task => {
              const start = task.startDate ? startOfDay(new Date(task.startDate)) : startOfDay(new Date(task.dueDate));
              const end = startOfDay(new Date(task.dueDate));
              
              let leftDays = differenceInDays(start, monthStart);
              let durationDays = differenceInDays(end, start) + 1;

              if (leftDays < 0) {
                durationDays += leftDays;
                leftDays = 0;
              }

              const maxDays = days.length;
              if (leftDays + durationDays > maxDays) {
                durationDays = maxDays - leftDays;
              }

              const left = leftDays * DAY_WIDTH;
              const width = durationDays * DAY_WIDTH;

              return (
                <div 
                  key={task.id} 
                  data-task-id={task.id}
                  className="flex border-b border-gray-100 hover:bg-gray-50/50 group"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  <div className="w-64 min-w-[16rem] flex-shrink-0 px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-white group-hover:bg-gray-50/80 truncate z-10 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {task.title}
                  </div>
                  
                  <div className="flex-1 relative min-w-0" style={{ minWidth: days.length * DAY_WIDTH }}>
                    <div className="absolute inset-0 flex pointer-events-none">
                      {days.map(day => (
                        <div 
                          key={day.toISOString()} 
                          className={clsx(
                            "flex-shrink-0 border-r h-full",
                            isToday(day) ? "border-blue-200 bg-blue-50/20" : "border-gray-100"
                          )}
                          style={{ width: DAY_WIDTH }}
                        />
                      ))}
                    </div>
                    
                    {width > 0 && (
                      <div 
                        className={clsx(
                          "absolute top-2 bottom-2 rounded-md shadow-sm border text-white text-[10px] font-medium px-2 flex items-center truncate cursor-pointer hover:brightness-110 transition-all z-10",
                          barColors[task.priority]
                        )}
                        style={{ left, width: Math.max(width, DAY_WIDTH - 4), marginLeft: 2 }}
                        title={`${task.title} (${format(start, 'MMM d')} - ${format(end, 'MMM d')})`}
                      >
                        {width > 60 ? task.title : ''}
                      </div>
                    )}
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
