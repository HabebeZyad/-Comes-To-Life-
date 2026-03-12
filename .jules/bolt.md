## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Preventing Interval Churn in React Timers]
**Learning:** React components that manage high-frequency state updates (like 1s timers) suffer from "interval churn" if the `setInterval` logic depends on the updating state (e.g. `timeLeft`). This causes the interval to be cleared and recreated every second, which is inefficient and can cause timing drift.
**Action:** Always use functional state updates (`setState(prev => ...)`) inside `setInterval` to remove the state dependency from the `useEffect` hook. Isolate the interval from other game logic (like victory/defeat checks) to keep the core timer stable.
