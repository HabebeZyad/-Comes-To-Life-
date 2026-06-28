## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-24 - [Lazy Loading Named Exports]
**Learning:** `React.lazy` only supports components exported as `default`. If a component is a named export, the promise must be intercepted to map the named export to the `default` key.
**Action:** Use the pattern `lazy(() => import('./path').then(m => ({ default: m.ComponentName })))` for named exports to ensure compatibility with `React.lazy` and prevent runtime crashes.
