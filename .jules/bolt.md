## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Memoizing Randomized UI Effects]
**Learning:** Decorative components that generate random positions (like `HieroglyphBackground`) not only waste CPU cycles when re-rendering but also cause visual "jitter" as elements jump to new random spots.
**Action:** Always wrap random data generation in `useMemo` and the component itself in `React.memo`. Move static configuration objects (like density maps) outside the component to prevent re-allocation.
