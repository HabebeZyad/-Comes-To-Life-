## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Optimized Games Hub via Component-Level Lazy Loading]
**Learning:** Statically importing 16 complex game components in a single route component (Games.tsx) created a massive 270 kB chunk, most of which was unused during the initial view. Using React.lazy and Suspense allows the browser to only fetch the specific game code when a user selects it.
**Action:** Use component-level lazy loading for routes that host multiple distinct, heavy interactive components. Standardize on the shared PageLoader component for a consistent loading experience.

## 2025-05-23 - [Unintended Lockfile Bloat]
**Learning:** Running 'pnpm install' in this environment can trigger significant updates to pnpm-lock.yaml, including adding heavy 3D libraries (three.js) that aren't yet explicitly needed by the changed files, leading to PR pollution.
**Action:** Always verify git status after dependency-related commands and restore the lockfile if changes are unrelated to the mission.
