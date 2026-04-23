## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Component-Level Code Splitting for Games Hub]
**Learning:** The Games Hub page previously bundled all 15 game components into the main bundle, even though only one is ever active. This led to a large initial payload. Implementing `React.lazy` with a themed `Suspense` fallback correctly split these into smaller chunks, improving initial load speed.
**Action:** Always consider `React.lazy` for pages that conditionally render multiple heavy components. Ensure both default and named exports are handled correctly in the `lazy()` wrapper.
