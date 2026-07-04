## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [3D Asset Code Splitting]
**Learning:** Top-level imports of Three.js and OrbitControls in components that are widely used (even if just as a preview) will pull the entire ~1MB engine into the initial route chunk.
**Action:** Split components into lightweight CSS/SVG "previews" and heavy WebGL "viewers". Use `React.lazy` with `Suspense` for the WebGL variant to ensure the engine dependency is isolated into a separate chunk and only fetched on demand.
