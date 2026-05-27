## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-05-18 - [Component-Level Code Splitting for Games Hub]
**Learning:** In a hub-style page that acts as a router for multiple heavy components (like the Games arcade), synchronous imports of all potential views create a massive initial chunk (~391 kB). By using React.lazy and Suspense, the initial chunk size was reduced by ~92% (to ~28 kB).
**Action:** Use component-level code splitting for heavy sub-components that are conditionally rendered. Standardize on a shared PageLoader component as the Suspense fallback to maintain a consistent user experience during lazy transitions.
