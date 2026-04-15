## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-22 - [Standardizing Lazy Imports for Mixed Export Patterns]
**Learning:** The codebase uses an inconsistent mix of default and named exports across game components. Relying on the default `lazy(() => import(path))` pattern causes runtime failures for components that only provide named exports.
**Action:** When refactoring for code-splitting in this repo, always use the `.then(m => ({ default: m.ComponentName }))` pattern to guarantee compatibility and prevent "Element type is invalid" crashes during hydration.
