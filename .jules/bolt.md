## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Code Splitting and Web Audio Optimization]
**Learning:** Route-level and component-level code splitting using `React.lazy` and `Suspense` significantly reduced the initial bundle size (from 1.18 MB to 473 KB, a ~60% reduction). In Web Audio API, simply calling `oscillator.stop()` is not enough to immediately release resources; calling `.disconnect()` on all nodes in the graph is necessary to prevent cumulative CPU overhead from "ghost" nodes.
**Action:** Implement route-level code splitting for all non-critical pages. For pages with many heavy sub-components (like Games), use component-level splitting. Always call `.disconnect()` on oscillators and gain nodes during cleanup in `useGameAudio`.
