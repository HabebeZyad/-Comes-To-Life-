## 2025-05-22 - [Optimized Global Background Effect]
**Learning:** Initializing background particles in `useEffect` + `useState` causes a mandatory second render on every page mount, which is particularly expensive when the effect is present on nearly every route. Using `useMemo` allows for single-pass rendering.
**Action:** Use `useMemo` for stable, non-interactive data initialization instead of `useEffect` to eliminate mount-time flicker and improve TTI. Use `React.memo` for shared decorative components to avoid redundant re-renders from parent state changes.

## 2025-05-23 - [Offloading High-Density Decorative Animations to CSS]
**Learning:** Rendering 200+ `motion.div` elements (Framer Motion) for simple decorative effects like stars creates significant overhead on the JS main thread for state tracking and orchestration. CSS Keyframe animations combined with CSS Variables allow these animations to run on the compositor thread, virtually eliminating the JS cost.
**Action:** Replace high-count JS-driven decorative elements with static elements and CSS variable-driven keyframe animations. Always wrap these components in `React.memo` when they are placed in dynamic parent containers (like `StoryReader.tsx`) to prevent expensive reconciliation during parent updates.
