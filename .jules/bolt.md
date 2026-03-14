## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Route and Component-Level Code Splitting]
**Learning:** Large monolithic bundles (1MB+) significantly impact initial load performance and TTI. Implementing `React.lazy` and `Suspense` for routes and heavy conditionally-rendered components (like games) can drastically reduce the entry bundle size. In this app, it reduced the main bundle from 1.18MB to 451KB (~62% reduction).
**Action:** Always lazy-load top-level routes and heavy game modules. Use a standardized `Suspense` fallback (e.g., a centered `Loader2` spinner) to maintain a professional UX during chunk fetching.
