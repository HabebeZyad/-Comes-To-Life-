## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Eliminated Game Timer Interval Churn]
**Learning:** Including frequently updating state (like `timeLeft` or `score`) in a `useEffect` dependency array that sets an interval causes "interval churn"—the interval is cleared and re-created on every tick. This is inefficient and can cause timing drift.
**Action:** Separate the interval decrement logic from the state-dependent side effects (sounds, game-over) into two `useEffect` hooks. Use functional updates (`prev => prev - 1`) in the interval hook to keep it stable.
