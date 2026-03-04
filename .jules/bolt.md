## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-03-04 - [Preventing Interval Churn in Game Timers]
**Learning:** Including frequently changing state (like `timeLeft` or `score`) in a `useEffect` dependency array that manages a `setInterval` causes the interval to be cleared and recreated on every update. This 'interval churn' can lead to inaccurate timing if updates happen frequently (e.g., scoring multiple times per second).
**Action:** Use functional state updates (`setX(prev => prev + 1)`) within the interval and remove the changing state from the dependency array. Separate game-ending logic (victory/defeat) into its own `useEffect` triggered by the state reaching a target value.

## 2026-03-04 - [Gated State Updates for High-Frequency Logic]
**Learning:** Unconditionally calling state setters in high-frequency loops (like a 100ms expiry check) triggers React re-renders even when the underlying data hasn't effectively changed (e.g., when a filter returns a new array with the same elements).
**Action:** Check if an update is actually necessary (using `.some()` or reference comparison) before calling the state setter to preserve reference equality and skip redundant renders.
