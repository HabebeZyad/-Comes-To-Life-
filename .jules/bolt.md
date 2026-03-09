## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-24 - [Optimized Audio Lifecycle & Resource Cleanup]
**Learning:** In the Web Audio API, nodes like `OscillatorNode` and `GainNode` can remain in memory even after being stopped if they are still connected to the audio graph. This leads to cumulative resource leaks and CPU overhead.
**Action:** Always call `.disconnect()` on audio nodes during cleanup. Ensure `stopAmbientMusic()` is called at the start of `startAmbientMusic()` to prevent overlapping audio loops and leaked intervals. Reorder hook functions to ensure safe reference before declaration.
