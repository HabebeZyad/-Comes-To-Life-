## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-24 - [Offloading Decorative Animations to CSS]
**Learning:** Rendering hundreds of `motion.div` elements with infinite animations in Framer Motion consumes significant JS main-thread resources, leading to frame drops during parent re-renders. CSS Animations are handled by the browser's compositor thread and are much more efficient for decorative infinite loops.
**Action:** Replace Framer Motion with CSS keyframe animations for large numbers of decorative elements. Use CSS variables to pass random initialization values from JS to CSS to maintain variety while reducing JS execution overhead.
