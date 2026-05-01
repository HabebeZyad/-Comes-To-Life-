## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Component-Level Code Splitting for Multi-Game Portal]
**Learning:** Statically importing dozens of complex game components or 3D viewers into a single portal page causes massive initial chunk sizes (250kB+), even with route-level splitting. Strategic use of `React.lazy` for individual components within a route can reduce the entry chunk by 90%+.
**Action:** Lazy-load individual game titles and heavy 3D/AI components. Use `PageLoader` for full-screen transitions and `LoadingSpinner` for inline/partial content to maintain UX stability. Ensure `Suspense` fallbacks are styled (e.g. `rounded-full`) to match the lazy component's shape.
