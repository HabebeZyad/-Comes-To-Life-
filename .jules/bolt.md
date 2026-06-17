## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-24 - [CSS Compositor Thread vs JS Main Thread for High-Count Animations]
**Learning:** Rendering 200+ decorative elements using Framer Motion (JS-driven) causes significant main-thread contention. Offloading these animations to CSS Keyframes using CSS Modules and CSS Variables utilizes the browser's compositor thread, drastically reducing JS load and improving frame stability during page transitions.
**Action:** For background effects or large particle systems, prefer CSS animations over JS-based libraries. Use CSS variables to maintain dynamic control without the per-frame JS overhead.
