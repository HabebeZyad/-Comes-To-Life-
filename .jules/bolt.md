## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-24 - [Component-level Code Splitting for Content-heavy Pages]
**Learning:** In pages like `Games.tsx` and `Stories.tsx` where many heavy components (Games, 3D Orbs, AI scanners) are loaded but only one is typically active at a time, route-level splitting is insufficient. Component-level `React.lazy` reduced the `Games` chunk by ~88% and `Stories` chunk by ~80%.
**Action:** Use `React.lazy` and `Suspense` for heavy or mutually exclusive components within a page to keep entry chunks lean and defer loading of heavy assets.

## 2025-05-24 - [Unintended Lockfile Updates]
**Learning:** Running `pnpm install` in the sandbox environment can trigger significant, unintended updates to `pnpm-lock.yaml`.
**Action:** Always check `git status` after environment setup and `git restore` the lockfile if it was modified but no new dependencies were explicitly requested, to avoid PR rejection for excessive scope.
