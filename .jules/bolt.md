## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Optimized Web Audio Resource Management]
**Learning:** Calling `.stop()` on Web Audio oscillators is insufficient for garbage collection if nodes remain connected to the audio graph. Furthermore, improper hook cleanup or multiple calls to ambient start functions can lead to overlapping `setInterval` loops and cumulative CPU overhead as multiple audio sessions run concurrently.
**Action:** Always explicitly call `.disconnect()` on all `OscillatorNode` and `GainNode` instances during cleanup. Ensure `stopAmbientMusic()` is called at the beginning of `startAmbientMusic()` to clear existing intervals and audio nodes before starting new ones.
