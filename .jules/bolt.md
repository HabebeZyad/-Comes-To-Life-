## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Route-Level Component Lazy Loading]
**Learning:** Route components that serve as hubs for many heavy sub-components (like a Games page with 18+ games) are primary candidates for code-splitting. Statically importing all sub-components bloats the initial route chunk significantly (~443kB in this case).
**Action:** Use `React.lazy` and `Suspense` to defer loading of sub-components until they are actually rendered. This reduced the `Games.tsx` chunk size by ~91%. Shared thematic loaders (e.g., `PageLoader`) should be extracted to common directories to provide consistent feedback during async chunk loading.
