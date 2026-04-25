## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Code Splitting for Routes and Components]
**Learning:** The production JS bundle was exceeding 1.1 MB, largely due to dozens of game components being eagerly imported into the Games portal. Implementing route-level and component-level code splitting reduced the main bundle by ~61%.
**Action:** Implement `React.lazy` and `Suspense` for all route components and heavy feature components (like individual games) to ensure users only download the code they are currently using. Use a themed `PageLoader` to maintain UX during transitions.
