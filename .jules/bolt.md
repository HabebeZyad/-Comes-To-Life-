## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-04-12 - [Code-Splitting Game Modules]
**Learning:** Eagerly importing 15+ complex game components in a single portal page causes the main bundle to exceed 1MB, triggering performance warnings and slowing initial TTI.
**Action:** Use `React.lazy` and `Suspense` for component-level code splitting on routes or pages that host multiple heavyweight, mutually exclusive modules. This reduced the main bundle size by ~19% and improved initial load performance.
