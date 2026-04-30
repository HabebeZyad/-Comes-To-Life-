## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy-loading Heavy Three.js and AI Components]
**Learning:** The `Stories` page was bloated by heavy dependencies like Three.js (`ScryingOrb`) and AI logic (`HieroglyphScanner`, `SceneGenerator`), resulting in a 241.13 kB chunk. These components are often "below the fold" or behind interactions (like modals), making them perfect candidates for code-splitting.
**Action:** Strategic use of `React.lazy` and `Suspense` for heavy, interaction-gated components reduced the `Stories` page initial chunk size by ~79% (down to 49.62 kB), significantly improving Time to Interactive for the main route.
