## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Lazy Loading with Mixed Export Patterns]
**Learning:** When implement code splitting in a directory with inconsistent export patterns (some components using `export default` and others using named `export function`), `React.lazy` must be carefully configured. Standard `lazy(() => import('...'))` only works for default exports; named exports must be mapped via `.then(m => ({ default: m.ExportName }))`.
**Action:** Always verify the export style of a component before lazy loading. If a module has both, `React.lazy` will prefer the default export if present, but named exports require manual mapping to a `default` property.
