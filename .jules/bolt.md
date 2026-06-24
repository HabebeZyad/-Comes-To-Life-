## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-06-24 - [Stable Animation Props in Framer Motion Loops]
**Learning:** Using `Math.random()` directly within Framer Motion `transition` props inside a looped render (like star fields) causes `framer-motion` to treat every re-render as a prop change, triggering redundant animation recalculations and inconsistent timing.
**Action:** Always pre-calculate random animation properties (duration, delay) within `useMemo` to ensure stable props and efficient animation execution.
