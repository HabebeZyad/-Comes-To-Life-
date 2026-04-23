## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-04-19 - [Route and Component Level Code Splitting]
**Learning:** Eagerly loading all route components and complex interactive game components in the main bundle creates a significant performance bottleneck (~1.18 MB initial payload). Implementing dual-level code splitting ensures the browser only downloads the necessary code for the current view, dramatically improving initial load times.
**Action:** Use `React.lazy` for route-level components in `App.tsx` and for heavy component variations (like individual games) in portal pages. Always provide a themed `Suspense` fallback to maintain visual consistency during asynchronous chunk fetching.
