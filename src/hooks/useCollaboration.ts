import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useCollaboration(intervalMs: number = 2500) {
  const { tasks, presenceUsers, updatePresenceUser } = useStore();

  useEffect(() => {
    if (tasks.length === 0 || presenceUsers.length === 0) return;

    const intervalId = setInterval(() => {
      // Pick a random user
      const randomUser = presenceUsers[Math.floor(Math.random() * presenceUsers.length)];
      // Pick a random task from the first 50 tasks to keep activity visible
      const randomTask = tasks[Math.floor(Math.random() * Math.min(tasks.length, 50))];
      
      updatePresenceUser(randomUser.id, randomTask.id);
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [tasks, presenceUsers, updatePresenceUser, intervalMs]);
}
