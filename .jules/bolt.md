## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Optimized Game Lifecycle & Resource Management]
**Learning:** React components using `setInterval` with a state-dependent delay (e.g., `timeLeft`) suffer from "interval churn," where the timer is torn down and rebuilt every second. This adds overhead and can lead to drift. Additionally, synthesizing audio using Web Audio API requires explicit cleanup of oscillators and intervals to prevent resource leaks.
**Action:** Decouple the `setInterval` logic from the state it updates by using functional updates (e.g., `setTimeLeft(t => t - 1)`) and removing the state from the dependency array. Separate timer side-effects (sound, game over) into a distinct, specialized `useEffect`. Always ensure audio cleanup functions are defined before use to avoid `ReferenceError` in dependency arrays.
