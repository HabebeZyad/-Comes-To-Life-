## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Component-level Code Splitting for Games]
**Learning:** The Games page was a primary performance bottleneck due to static imports of 18 separate game components, resulting in a single large chunk (~390kB). Implementing component-level lazy loading significantly reduces the entry payload.
**Action:** Use `React.lazy` and `Suspense` for heavy components that are conditionally rendered (like game instances or the Leaderboard) to defer their weight until actually needed. Extracting the `PageLoader` fallback into a shared component ensures a consistent themed experience across all lazy-loaded boundaries.
