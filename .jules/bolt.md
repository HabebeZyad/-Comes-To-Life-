## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-22 - [Route and Component-level Code Splitting]
**Learning:** A single monolithic bundle (e.g., ~1.2MB) significantly impacts Time to Interactive (TTI). Vite's default build output flags chunks > 500kB as candidates for code-splitting. Implementing `React.lazy` at both the route level and for large, mutually exclusive components (like individual games in a hub) can drastically reduce the initial payload.
**Action:** Always check bundle sizes with `pnpm build`. Use `React.lazy` and `Suspense` for routes and heavy components that aren't immediately needed on the landing page. Ensure standardized loading fallbacks are used to maintain UX during chunk loading.
