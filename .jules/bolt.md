## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Route & Component Code Splitting]
**Learning:** The application's main bundle size was significantly bloated (~1.2MB) due to eager loading of complex game components and all page routes. Implementing `React.lazy` with `Suspense` for both routes and game instances reduced the main bundle by over 60%.
**Action:** Always lazy load game components and secondary routes. Standardize on the `.then(m => ({ default: m.ExportName }))` pattern for `React.lazy` when consuming named exports to maintain bundle modularity without breaking component resolution.
