## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Multi-Level Code Splitting]
**Learning:** Large monolithic bundles (>1MB) significantly impact initial TTI. Implementing both route-level and component-level (for heavy sub-modules like Games) code splitting is necessary when a site has many resource-intensive interactive elements. Vite's build output explicitly warns about chunks >500kB, which is a reliable trigger for this optimization.
**Action:** Always check `pnpm build` output for chunk size warnings. Use `React.lazy` for all page-level components in `App.tsx` and further split heavy functional components (like individual games) to keep the entry chunk as small as possible (~450kB is a good target for this stack).
