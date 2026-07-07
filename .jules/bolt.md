## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy-loading Three.js in ScryingOrb]
**Learning:** The `ScryingOrb` component was a major bundle size driver because it imported Three.js and the ~883kB `OrbitControls` at the top level, even when used solely as a decorative CSS-only "globe" in lists. Vite's default code-splitting doesn't always isolate these dependencies if they are part of a shared component used in critical routes like `Stories`.
**Action:** Manually split components into "Light" (CSS/Framer Motion only) and "Heavy" (Three.js/Engine) variants. Use `React.lazy` to load the heavy engine only when interactive mode is explicitly requested.
