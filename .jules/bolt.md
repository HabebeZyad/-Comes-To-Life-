## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Implemented Application-Wide Code Splitting]
**Learning:** The application bundle was exceeding 1MB due to the large number of game components and storytelling pages being bundled into a single chunk. Implementing route-level splitting in `App.tsx` and component-level splitting in `Games.tsx` reduced the main bundle size by ~62% (from 1.18MB to 452KB).
**Action:** Always use `React.lazy` for individual game modules or feature-rich pages that are not part of the critical initial render path. Use a standardized `Loader` component for `Suspense` fallbacks to ensure a consistent UX during chunk loading.
