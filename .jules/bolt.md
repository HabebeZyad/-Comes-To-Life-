## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-04-24 - [Route and Component Level Code Splitting]
**Learning:** The initial JS bundle was exceeding 1MB due to eager loading of all page routes and 15+ game components. Implementing lazy loading with `React.lazy` and `Suspense` allows the browser to download only the necessary code for the current route and specific game, drastically improving Time to Interactive (TTI).
**Action:** Always check the main bundle size for large component libraries. Use `Suspense` with a themed `PageLoader` to maintain UX while fetching chunks. Standardize on the `.then(m => ({ default: m.ExportName }))` pattern for lazy loading named exports to ensure compatibility with `React.lazy`.
