## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Optimized Celestial Simulation]
**Learning:** Animating hundreds of DOM elements with Framer Motion (JavaScript-driven) causes high main-thread utilization and frame drops. Offloading these animations to CSS Keyframes using CSS variables allows the browser to use the compositor thread for much smoother performance.
**Action:** For high-count repetitive animations, prioritize CSS animations over JS-driven animation libraries. Use `React.memo` to skip virtual DOM diffing for complex decorative backgrounds.
