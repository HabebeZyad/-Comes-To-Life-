## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Stable Animation Durations in Loops]
**Learning:** Using volatile values like `Math.random()` directly within Framer Motion `transition` props inside a loop (e.g., generating 200+ stars) is a performance anti-pattern. It leads to inconsistent animation states and forces recalculation of transition objects on every render cycle.
**Action:** Always pre-calculate randomized animation parameters (durations, delays, positions) within `useMemo` to ensure stability across re-renders and reduce CPU overhead during the render phase.
