## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-03-29 - [Optimized Games Hub with Code Splitting]
**Learning:** Statically importing a large suite of complex components (16+ games) into a single page creates a massive initial bundle bottleneck. Implementing component-level code splitting reduced the initial index chunk by ~225KB (~19%) and improved Time to Interactive for the Games page.
**Action:** Use `React.lazy` with `Suspense` for heavy, conditionally-rendered components. Always verify whether components use default or named exports to ensure the correct dynamic import pattern is applied; for named exports, use the `.then(m => ({ default: m.Name }))` pattern.
