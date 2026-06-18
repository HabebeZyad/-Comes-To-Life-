## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-06-18 - [Optimized Celestial Simulation & Animation Stability]
**Learning:** Calling `Math.random()` inside a `map` loop for Framer Motion animation properties (like duration) causes unstable animation states and prevents React from skipping renders effectively. Component-level memoization is most effective when child animation parameters are stable and pre-calculated.
**Action:** Move all randomization logic into `useMemo` initialization blocks. Pre-calculate animation durations and delays as stable object properties. Always wrap high-count decorative components in `React.memo` to prevent parent state changes from triggering expensive reconciliations of many DOM nodes.
