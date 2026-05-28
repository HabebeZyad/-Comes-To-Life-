## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-05-19 - [Component-level Code Splitting & Named Exports]
**Learning:** When implement code splitting with `React.lazy`, components that provide both named and default exports must be handled carefully. If the rest of the codebase expects the named export's specific type or behavior, the lazy import must use `.then(m => ({ default: m.ExportName }))`.
**Action:** Always verify the export style of components before converting to lazy loading to prevent runtime "default export not found" errors or type mismatches.
