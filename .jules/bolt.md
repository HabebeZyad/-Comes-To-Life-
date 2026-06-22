## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy Loading Route-Specific Components]
**Learning:** The Games hub was importing 19 game components and a heavy Leaderboard component synchronously, causing the route chunk to swell to ~444 kB. Implementing lazy loading with Suspense reduced the route chunk to ~31 kB (a 93% reduction).
**Action:** Always lazy load sub-components that are only visible after a user action (e.g., modals, game screens, tab content) to keep the initial route weight low. Use a shared thematic loader for consistency.
