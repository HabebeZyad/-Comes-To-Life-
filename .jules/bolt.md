## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Implemented Code Splitting for Routes and Games]
**Learning:** Large initial bundle sizes (over 1MB) significantly impact TTI. Splitting the application at the route level and further splitting heavy components like interactive games can drastically reduce the entry chunk size. Named exports from lazy-loaded modules require a `.then(m => ({ default: m.ExportName }))` wrapper.
**Action:** Always check `pnpm build` output for chunk size warnings. Prioritize lazy loading for routes and heavy interactive components to keep the main bundle under 500kB.
