## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Offloading High-Count Animations to CSS]
**Learning:** Animating 200+ elements using JS-driven libraries like Framer Motion for infinite decorative effects (like a star field) consumes significant main-thread resources, leading to high CPU usage and potential frame drops. Offloading these to the browser's compositor thread using CSS Keyframe animations and CSS Variables (for randomization) provides identical visual results with negligible main-thread overhead.
**Action:** For infinite decorative animations with many elements, prefer CSS Keyframes over JS animation libraries. Use CSS variables to pass randomized initialization values from `useMemo` to the stylesheet to maintain visual variety without sacrificing performance.
