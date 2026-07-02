## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy Loading High-Density Route Components]
**Learning:** Routes that act as hubs (like a Games Arcade) can quickly become massive bottlenecks if they eagerly import every child component, even if only one is shown at a time. A single route's bundle size can exceed the rest of the application combined.
**Action:** Implement `React.lazy` and `Suspense` for all conditionally rendered components in high-density routes. Extract reusable loading UI to a shared layout component to ensure consistent UX during code-splitting transitions.
