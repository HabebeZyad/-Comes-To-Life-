## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy Loading Route Components]
**Learning:** Routes importing many heavy components (like the Games hub) result in massive initial chunks (~445kB) even if only one component is rendered at a time. Implementing `React.lazy` for all child components and wrapping them in `Suspense` allows Vite to split them into tiny individual chunks.
**Action:** Identify routes that conditionally render many large components and transition them to `React.lazy` with a shared `PageLoader` fallback to optimize TTI and reduce initial payload.
