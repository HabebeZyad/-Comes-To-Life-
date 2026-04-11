## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Component-Level Code Splitting for Games Hub]
**Learning:** Static imports of numerous large components (15 games) in a single hub page significantly bloats the initial bundle (1.18 MB) and delays TTI. Code splitting via `React.lazy` successfully reduced the main bundle size by ~18.6%.
**Action:** Use `React.lazy` and `Suspense` for routes or hub pages that orchestrate many complex components. Ensure correct handling of named vs default exports to prevent runtime loading failures.
