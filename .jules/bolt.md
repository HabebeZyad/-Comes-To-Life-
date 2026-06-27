## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy Loading Games Hub]
**Learning:** Statically importing multiple heavy game components in a single hub page (like Games.tsx) severely bloats the initial route chunk, delaying TTI. Lazy loading individual games reduces the initial chunk size by over 90% (~445kB to ~31kB) without impacting user experience, as games are loaded on-demand.
**Action:** Use `React.lazy` and `Suspense` for routes or components that serve as "hubs" for multiple heavy, mutually exclusive sub-components. Extract shared `Suspense` fallbacks (e.g., `PageLoader`) to maintain thematic consistency.
