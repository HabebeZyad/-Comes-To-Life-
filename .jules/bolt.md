## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Isolated Heavy 3D Dependencies via Component Splitting]
**Learning:** Monolithic components that switch between lightweight CSS modes and heavy 3D modes (Three.js/Fiber) still pull in all dependencies into the main chunk. Vite/Rollup cannot tree-shake these if they are imported at the top level of the component file.
**Action:** Manually split components into light (CSS/SVG) and heavy (Three.js) variants. Use `lazy` and `Suspense` to load the heavy variant only when active. This isolated `OrbitControls` (~883 kB) and other Three.js dependencies from the initial route chunks.
