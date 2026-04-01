## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Code Splitting for Games and Routes]
**Learning:** The application had a monolithic bundle (~1.18 MB) due to static imports of all pages and over 15 complex game components. Implementing both route-level and component-level code splitting reduced the initial bundle size to ~451 kB (~62% reduction), significantly improving Time to Interactive (TTI).
**Action:** Use `React.lazy` and `Suspense` for all page-level routes and heavy sub-components (like individual games). Ensure named exports are handled using the `.then(m => ({ default: m.ExportName }))` pattern to maintain compatibility with lazy loading.
