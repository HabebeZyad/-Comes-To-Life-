## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Game Timer Interval Churn and False Updates]
**Learning:** Recreating `setInterval` on every tick (by including the timer state in the dependency array) causes unnecessary overhead and timing drift. Additionally, calling state setters with filtered arrays every 100ms without checking if any items actually expired causes 10 re-renders per second even when the state is functionally identical.
**Action:** Always gate timer-based state updates with a length or equality check to avoid redundant renders in high-frequency loops. Use stable interval patterns (no timer state in dependencies) to prevent "interval churn" and maintain accurate timing.
