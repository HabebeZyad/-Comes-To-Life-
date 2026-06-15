## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-05-28 - [Offloaded High-Count Animations to CSS]
**Learning:** Rendering 200+ stars using Framer Motion's `motion.div` with infinite animations puts a heavy load on the JavaScript main thread, especially when used on pages with other interactive elements (like `StoryReader.tsx`).
**Action:** Use CSS Modules with CSS Variables and `@keyframes` to offload high-count, simple animations to the browser's compositor thread. This significantly reduces JS main-thread load and prevents parent state updates from causing expensive animation re-calculations.
