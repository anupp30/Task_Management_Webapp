# Multi-View Project Tracker

A highly performant frontend application built with React, TypeScript, Tailwind CSS, and Zustand. Features a library-free custom drag-and-drop system and virtual scrolling implementation.

## Setup Steps

1. Ensure Node.js is installed.
2. Run `npm install` within this directory to install dependencies.
3. Run `npm run dev` to start the development server.
4. Open the browser (typically `http://localhost:5173`) to view the application.

## State Management Explanation

We use **Zustand** for all global state management. The central store (`src/store/useStore.ts`) perfectly manages:
- `tasks`: An array of 500 randomly generated tasks.
- `filters`: Global filter state applied across all views.
- `presenceUsers`: Shared array of mock active users for real-time collaboration simulation.
- Core UI state variables such as `activeView`, `draggedTaskId`, and `hoveredColumn`.

## Custom Drag-and-Drop Logic (No Libraries)

Implemented purely with React and native pointer events (`onPointerDown`, `pointermove`, `pointerup`):
1. **Pointer Event**: Clicking a TaskCard sets the `draggedTaskId` in the global store.
2. **Visual Feedback (`DragOverlay.tsx`)**: A central component renders a visual clone of the task tracking the exact cursor coordinates.
3. **Target Hit-Testing**: Rather than math collision, we leverage native `document.elementsFromPoint(x, y)` inside `pointermove` to detect drop targets via their custom `data-column-status` DOM attribute.
4. **Placeholder**: Rather than causing layout shift with strict placeholder divs, the active dragging card in the column retains its spatial height with heavily dashed transparency (`opacity-40`). 

## Custom Virtual Scrolling Logic

Handled inside `src/hooks/useVirtualScroll.ts` for parsing 500 list and timeline rows seamlessly:
1. **Scroll Indexation**: Listens to scroll events with performant `requestAnimationFrame` debouncing. 
2. **Bounded Container**: A synthetic inner container represents the actual massive table height `totalItems * rowHeight`. 
3. **Slice Range**: By estimating the window offset, it only slices out standard items between `startIndex` and `endIndex` + overscan buffer.
4. **Offset Translation**: These elements are bundled and positioned with a simple `translateY(offset)` mapping wrapper to remain on screen correctly.

## Live Collaboration System
To simulate real concurrent multiplayer behavior without WebSockets, a global `useCollaboration()` hook acts on intervals to shuffle mock users around randomly by assigning them `task.ids`.
A global coordinate-tracking absolute element system (`CollaborationOverlay.tsx`) queries the standard DOM (`data-task-id`) utilizing raw `getBoundingClientRect()` to perfectly float Avatars above moving items smoothly through CSS transitions!

## Deployment

Deploy this frontend cleanly pushing to Vercel/Netlify via GitHub. It requires zero sensitive Environment Variables.
