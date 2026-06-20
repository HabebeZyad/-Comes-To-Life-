## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy-Loading Heavy 3D Engines]
**Learning:** Top-level imports of 'three' and associated libraries in shared UI components like 'ScryingOrb' can bloat the initial bundle by ~1MB. Splitting components into a lightweight CSS-based version and a heavy 3D version allows for efficient lazy-loading.
**Action:** Extract heavy engine-dependent logic into separate files and use React.lazy to defer loading until the feature is explicitly activated, ensuring the critical path remains lightweight.
