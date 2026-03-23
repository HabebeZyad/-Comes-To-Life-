## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Code Splitting for Games and Routes]
**Learning:** The initial bundle size was over 1.1 MB due to the inclusion of all game modules and page components in the main chunk. Implementing route-level and component-level code splitting reduced the main bundle size by ~62% (to 452 KB).
**Action:** Always use `React.lazy` for page-level routes and heavy leaf components (like individual games) to keep the initial payload lean. Use a standardized `Loader` component for `Suspense` boundaries to ensure visual consistency during chunk loading.
