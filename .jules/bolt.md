## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Multi-level Code Splitting]
**Learning:** A monolithic 1.18 MB bundle was primarily composed of individual game modules and page routes that are not needed immediately. Combining route-level splitting with component-level splitting for heavy interactive modules (Games) reduced the initial bundle size by ~62% (to 452 KB).
**Action:** Identify chunks > 500 KB in Vite builds. Use `React.lazy` for routes and `lazy(() => import('path').then(m => ({ default: m.Export })))` for named exports in module records to ensure efficient chunking.
