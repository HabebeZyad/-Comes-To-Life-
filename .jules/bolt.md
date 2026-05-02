## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-05-02 - [Lazy-loaded Game Components Optimization]
**Learning:** Lazy-loading individual game components in the Games Hub using `React.lazy` and `Suspense` significantly reduces the initial entry chunk size for the page (91% reduction in this case). However, it requires careful handling of export patterns; components originally imported as named exports must be standardized using the `.then(m => ({ default: m.ExportName }))` pattern even if they also provide a default export, to maintain consistency and avoid runtime errors.
**Action:** Standardize `React.lazy` imports for multi-component hubs using the `.then()` pattern for named exports. Always verify each lazy-loaded route/component post-build to ensure default vs. named export compatibility.
