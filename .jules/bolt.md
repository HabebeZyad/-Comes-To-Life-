## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Preventing Interval Churn in Game Timers]
**Learning:** Standard timer patterns that include `timeLeft` in the `useEffect` dependency array cause 'interval churn', where the interval is destroyed and recreated every second. This can be optimized by separating the 1s interval from game logic side effects. However, care must be taken when splitting effects to ensure that state-dependent side effects (like audio 'ticks') aren't inadvertently triggered by unrelated state updates (like score changes).
**Action:** Decouple `setInterval` from side-effect logic. Use functional state updates (`setTimeLeft(prev => ...)`) to remove state dependencies from the interval effect. Split side effects into granular `useEffect` hooks to maintain pure logic paths.
