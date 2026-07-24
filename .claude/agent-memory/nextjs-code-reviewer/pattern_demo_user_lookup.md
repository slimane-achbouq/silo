---
name: pattern_demo_user_lookup
description: Recurring N+1-style pattern where every src/lib/db/* helper independently looks up the demo user by email before its real query
type: project
---

`src/lib/db/collections.ts` and `src/lib/db/items.ts` each export several functions
(`getRecentCollections`, `getFavoriteCollections`, `getPinnedItems`, `getRecentItems`,
`getItemTypes`, `getDashboardStats`) that **each** independently run
`prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } })` before doing their real
query. `/dashboard` (layout + page) calls 6 of these in the same request, meaning 6
redundant `SELECT` round-trips just to resolve the same user id every single page load.

**Why:** This is a stand-in for real auth (session -> userId) that hasn't been wired up
yet. The `// TODO: replace with the authenticated user's id once auth is wired up.`
comment appears in both files.

**How to apply:** When NextAuth v5 lands, this whole pattern should collapse — the
userId will come from the session in the server component/layout once, not be
re-fetched per-helper. Flag this as a performance/duplication issue in reviews until
that migration happens. After auth lands, verify this comment and pattern are actually
gone before citing it again (check for `DEMO_USER_EMAIL` via grep).
