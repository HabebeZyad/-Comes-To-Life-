## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-04-23 - [Route and Component-Level Code Splitting]
**Learning:** Large monolithic bundles (>1MB) significantly delay Time to Interactive. Deferring the loading of heavy route components and individual game modules via `React.lazy` and `Suspense` provides a massive reduction in initial bundle size.
**Action:** Implement code splitting at both the route level (App-wide) and component level (within heavy modules like Games) to keep the main bundle lean. Use a themed `PageLoader` to maintain UX during chunk fetches.
