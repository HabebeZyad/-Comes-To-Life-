## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Eliminating Interval Churn in Timers]
**Learning:** Recreating a `setInterval` every second (by including `timeLeft` in the `useEffect` dependency array) causes significant "interval churn". This resets the timer's internal clock on every tick, which can lead to drift and unnecessary CPU cycles for effect cleanup/setup.
**Action:** Separate the interval from game-over logic. Use a stable interval effect that only depends on the `playing` state and use functional updates (`setTimeLeft(prev => prev - 1)`) to modify state without triggering an interval reset.

## 2025-05-23 - [Preventing Audio Node Leaks]
**Learning:** Audio hooks that manage background music or loops can "leak" if multiple start calls occur without matching stops (e.g., on level restart). This creates multiple concurrent `setInterval` loops and overlapping oscillators, leading to cumulative CPU and memory bloat.
**Action:** Always call the `stop` function at the very beginning of the `start` function within audio hooks to ensure only one instance of the audio loop/nodes exists at any time.
