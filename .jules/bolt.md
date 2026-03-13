# Bolt's Journal - Critical Learnings

## 2025-05-14 - Route and Component-Level Code Splitting
**Learning:** The application was loading all pages and game modules in a single large bundle (~1.18 MB), significantly impacting initial load time and Time to Interactive (TTI). Implementing `React.lazy` and `Suspense` reduced the initial chunk size to ~452 KB (a ~62% reduction).
**Action:** Use `React.lazy` for route-level components in `App.tsx` and for dynamic sub-components (like individual games) in `Games.tsx`. For named exports, use the pattern `lazy(() => import('path').then(m => ({ default: m.ExportName })))`.
