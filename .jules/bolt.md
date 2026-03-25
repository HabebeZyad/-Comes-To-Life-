## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2026-03-25 - [Stable Game Timers & Route Splitting]
**Learning:** Game timers using `setInterval` in `useEffect` are highly prone to "interval churn" if they depend on the `timeLeft` state they are updating. Separating the tick logic (using functional updates) from the game-state monitoring (e.g., checking for 0s) creates a stable, drift-free clock. Additionally, route-level splitting in `App.tsx` is critical for this repo as the total uncompressed page bundle exceeds 1MB.
**Action:** Always decouple interval increments/decrements from state monitoring hooks. Use `Suspense` + `lazy` at the route level to keep main entry chunks < 500KB.
