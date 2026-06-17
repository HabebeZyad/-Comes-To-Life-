## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-05-13 - [Offloaded Large-Scale Animations to CSS]
**Learning:** Animating hundreds of individual SVG or div elements using JS-driven libraries (Framer Motion, GSAP) can saturate the main thread, especially on mobile or low-end devices. CSS Keyframes coupled with CSS Variables allow the browser to handle these animations on the compositor thread.
**Action:** For background effects with many elements (stars, particles), use CSS modules with `@keyframes` and pass dynamic properties via CSS variables to keep the JS thread free for interactive logic.
