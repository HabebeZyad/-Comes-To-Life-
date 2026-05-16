## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-05-16 - [Component-level Code Splitting for Asset-Heavy Hubs]
**Learning:** Even with route-level splitting, "hub" pages (like Games or Stories) that serve as gateways to many heavy features can suffer from massive chunk sizes if they statically import all child components.
**Action:** Use `React.lazy` with the `.then(m => ({ default: m.ExportName }))` pattern for named exports to aggressively split feature-heavy routes. Extract shared loading fallbacks (like `PageLoader`) to ensure a consistent UX during chunk fetching.
