## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-04-20 - [Implemented Comprehensive Code Splitting]
**Learning:** The application had a large monolithic main bundle (~1.2 MB) due to static imports of 15+ game components and all page routes. Implementing route-level and component-level code splitting significantly reduced the initial entry chunk.
**Action:** Use `React.lazy` and `Suspense` for all page routes and heavy feature components (like games). When storing lazy components in a Record or Map, use `React.ComponentType<P>` instead of `React.FC<P>` to maintain type safety and avoid linting/build errors.
