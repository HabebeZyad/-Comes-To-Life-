## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy Loaded 3D ScryingOrb]
**Learning:** Heavy 3D libraries like Three.js and OrbitControls (~1MB) can significantly bloat initial bundle sizes if imported directly into frequently-used components. Manual splitting into light (CSS/SVG) and heavy (Three.js) variants allows for effective lazy loading while maintaining visual continuity with a thematic fallback.
**Action:** Isolate heavy 3D logic into separate components and use `React.lazy` with a lightweight, visually-similar fallback (e.g., a pure CSS or SVG version of the asset) to defer engine loading until interaction or visibility.
