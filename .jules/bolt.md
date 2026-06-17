## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy Loading Games Hub]
**Learning:** The Games page bundle was heavily bloated (~443 kB) because it eagerly imported 17+ different game components, many of which are complex and contain their own logic/assets. Lazy loading these components reduces the initial route chunk size by over 90%.
**Action:** Identify hub pages that aggregate many distinct, heavy sub-components and implement `React.lazy` with a shared thematic loader to defer loading until the specific component is required by the user.
