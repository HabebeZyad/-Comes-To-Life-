## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-22 - [Route-Level Code Splitting Implementation]
**Learning:** In a modular Vite/React 18 project, the main bundle can rapidly inflate (e.g., reaching ~1.2 MB) as more game and story modules are added. Route-level code splitting is the most impactful single optimization to reduce the initial JS payload.
**Action:** Monitor build outputs for "large chunk" warnings. Implement `React.lazy` for all top-level page components and wrap `Routes` in a `Suspense` boundary with a standardized `Loader` fallback to optimize TTI without degrading the user experience.
