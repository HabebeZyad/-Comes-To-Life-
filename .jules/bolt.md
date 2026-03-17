## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Multi-level Code Splitting for Component Libraries]
**Learning:** In a modular application where a single route (e.g., `/games`) acts as a hub for many heavy sub-components, route-level code splitting alone is insufficient. The bundle size will remain large because the hub route still statically imports every sub-component.
**Action:** Implement multi-level code splitting by lazily loading both the routes in `App.tsx` AND the individual heavy components within the hub page. This reduces the initial bundle size significantly (e.g., from 1.2MB to 450KB) and ensures users only download the specific logic they interact with.
