## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Comprehensive Code Splitting]
**Learning:** In a content-heavy application with multiple standalone game modules and media-rich story episodes, a single monolithic bundle quickly exceeds performance budgets (1.18 MB). Standardizing on route-level AND conditional component-level (e.g., individual games within a hub) code splitting is essential for keeping the initial payload manageable.
**Action:** Always implement `React.lazy` for route components in `App.tsx` and for heavy conditional components in specialized hubs. Use a standardized `LoadingFallback` with `Loader2` for visual consistency during chunk fetching.
