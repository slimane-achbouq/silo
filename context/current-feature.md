# Current Feature: Auth Phase 2 - Credentials Provider (Email/Password)

## Status

In Progress

## Goals

- Add Credentials provider for email/password authentication with registration
- Use bcryptjs for hashing (already installed)
- Add password field to User model via migration if not already there
- Update `auth.config.ts` with Credentials provider placeholder (`authorize: () => null`)
- Update `auth.ts` to override Credentials with bcrypt validation
- Create registration API route at `POST /api/auth/register`:
  - Accept: name, email, password, confirmPassword
  - Validate passwords match
  - Check if user already exists
  - Hash password with bcryptjs
  - Create user in database
  - Return success/error response

## Notes

### Credentials Provider in Split Pattern
- `auth.config.ts`: Add Credentials provider with `authorize: () => null` placeholder (edge-compatible)
- `auth.ts`: Override the Credentials provider with actual bcrypt validation logic

### Testing
1. Test registration via curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","confirmPassword":"password123"}'
```
2. Go to `/api/auth/signin`
3. Sign in with email/password
4. Verify redirect to `/dashboard`
5. Verify GitHub OAuth still works

### References
- Credentials provider: https://authjs.dev/getting-started/authentication/credentials

## History

<!-- Keep this updated. Earliest to latest -->

### 2026-07-21 — Initial Next.js Setup
- Bootstrapped project with Create Next App (Next.js 16, React 19, TypeScript, Tailwind CSS v4)
- Configured `CLAUDE.md` with project instructions and context files
- Added `context/` directory with project overview, coding standards, AI interaction guidelines, and current feature tracking
- Removed default Next.js public assets (SVGs)

### 2026-07-22 — Dashboard UI Phase 1
- Initialized ShadCN UI and installed Button/Input components
- Added `/dashboard` route with layout, full-height sidebar (logo header + placeholder), and top bar (search, New collection, New item)
- Set dark mode as the default theme
- Verified build, lint, and rendering in the browser against the reference screenshot

### 2026-07-22 — Dashboard UI Phase 2
- Installed ShadCN Avatar, Sheet, Separator, Scroll Area, Tooltip, and Collapsible components
- Added collapsible sidebar (`DashboardShell`, `SidebarContent`) with Library nav, item type links (`/items/TYPE`) with counts, favorite collections, most recent collections, and a user avatar footer
- Added a mobile drawer (Sheet) triggered from the top bar, always used on mobile view
- Added desktop collapse/expand toggle for the sidebar
- Fixed a flex layout bug causing the sidebar header to shrink out of alignment with the top bar
- Verified build, lint, and rendering (desktop, collapsed, and mobile drawer) in the browser

### 2026-07-22 — Dashboard UI Phase 3
- Installed ShadCN Card and Badge components
- Added stats cards (items, collections, favorite items, favorite collections) to `/dashboard`
- Added recent collections, pinned items, and 10 recent items sections, sourced from mock data
- Added `getPinnedItems`, `getRecentItems`, `getDashboardStats`, `getItemType`, and `formatRelativeTime` helpers to `src/lib/dashboard.ts`
- Verified build, lint, and rendering in the browser

### 2026-07-22 — Prisma + Neon PostgreSQL Setup
- Installed Prisma 7.9.0, `@prisma/client`, `@prisma/adapter-neon`, and `dotenv`
- Added `prisma.config.ts` (Prisma 7 moves datasource connection config out of `schema.prisma` and into this file); CLI/migrations use `DIRECT_URL` (non-pooled Neon connection)
- Added `prisma/schema.prisma` with `provider = "prisma-client"` generator, `moduleFormat = "cjs"` (project isn't ESM), output to `src/generated/prisma`
- Modeled `User`, `Account`, `Session`, `VerificationToken` (Auth.js/NextAuth v5 Prisma adapter shape) alongside `Item`, `ItemType`, `Collection`, `Tag`, `ItemTag` from the project data model, with cascade deletes and indexes on foreign keys and common query patterns
- Added `src/lib/prisma.ts` client singleton using the `PrismaNeon` driver adapter (pooled `DATABASE_URL` at runtime, required in Prisma 7 — no default connection without an adapter)
- Ran `prisma migrate dev --name init` against Neon, then `prisma generate` (Prisma 7 no longer auto-generates the client after migrating)
- Added `.env.example` with `DATABASE_URL`/`DIRECT_URL` placeholders; excepted it from the `.env*` gitignore rule; gitignored the generated client output (`src/generated/prisma`)
- Verified the client connects and queries Neon end-to-end via a throwaway `tsx` script (removed after verification)
- Verified build and lint pass

### 2026-07-22 — Seed Data
- Installed `bcryptjs` (+ `@types/bcryptjs`) for password hashing
- Wired `migrations.seed` in `prisma.config.ts` to `tsx prisma/seed.ts` so `prisma db seed` / post-migration seeding works
- Added `prisma/seed.ts`: upserts the demo `User` (slach@dev.io, bcrypt-hashed password at 12 rounds) and the 7 system `ItemType` rows (userId-less, `isSystem: true`), then resets and recreates the demo user's collections/items so the script is safe to re-run
- Seeded 5 collections per `context/features/seed-spec.md`: React Patterns (3 snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 links), Terminal Commands (4 commands), Design Resources (4 links) — 18 items total, using real URLs for link items
- Verified idempotency (ran the script twice, counts stayed stable) and via `npx prisma db seed`
- Verified build and lint pass

### 2026-07-22 — Dashboard Collections (Real Data)
- Added `src/lib/db/collections.ts` with `getRecentCollections()`, fetching the demo user's collections from Neon via Prisma (ordered by `updatedAt`, with per-item-type counts) to replace `src/lib/mock-data.ts` on the dashboard
- Added `src/lib/icons.ts` (`resolveLucideIcon`) to dynamically resolve the Lucide icon names stored on `ItemType` rows (e.g. `Code`, `Sparkles`) to components, since seeded data uses real Lucide names + hex colors rather than `mock-data.ts`'s lowercase keys/named colors
- Converted `RecentCollections` to an async server component: kept the existing 6-card layout, added a left border colored by the collection's most-used item type, small icons for each type present, and an item count
- Added `export const dynamic = "force-dynamic"` to `src/app/dashboard/page.tsx` so collection data is fetched fresh per request instead of baked in at build time
- Left `PinnedItems`, `RecentItems`, and `StatsCards` on mock data — out of scope per `context/features/dashboard-collections-spec.md` (items list under collections is a later feature)
- Data fetching currently hardcodes the demo user (`slach@dev.io`), matching `prisma/seed.ts`, until auth is implemented
- Verified build (`/dashboard` renders as dynamic `ƒ`, not static), lint, and rendering in the browser — confirmed real collection names, item counts, and per-collection border colors via a running dev server

### 2026-07-22 — Dashboard Items (Real Data)
- Added `src/lib/db/items.ts` with `getPinnedItems()`, `getRecentItems()`, and `getDashboardStats()`, fetching the demo user's items (and, for stats, collections) from Neon via Prisma, including each item's type and tags
- Converted `ItemCard`, `PinnedItems`, `RecentItems`, and `StatsCards` to async server components sourced from `src/lib/db/items.ts` instead of `src/lib/mock-data.ts`
- `ItemCard` now resolves its icon/color via `resolveLucideIcon` from the item's `ItemType` (matching the pattern used for collections) and renders tags as badges when present
- `getDashboardStats()` counts real items/collections (total + favorites) for `StatsCards`, replacing the mock-derived counts
- Confirmed no seeded items are pinned, so the "Pinned items" section correctly renders nothing per spec
- Left `src/lib/dashboard.ts`'s mock-backed sidebar helpers (`getItemType`, `getItemTypeIcon`, `getItemTypeColorClass`, `getItemTypeSlug`, `getFavoriteCollections`, `getItemCountByType`) untouched — `SidebarContent` still uses mock data, out of scope for this feature
- Verified build, lint, and rendering in the browser via a running dev server — confirmed real item titles, type badges, and relative timestamps

### 2026-07-22 — Stats & Sidebar (Real Data)
- Added `getItemTypes()` to `src/lib/db/items.ts`, fetching the 7 system `ItemType` rows plus a per-type item count for the demo user, sorted in a fixed display order (Snippet, Prompt, Command, Note, File, Image, Link) rather than alphabetically
- Added `getFavoriteCollections()` to `src/lib/db/collections.ts`, sharing the existing `CollectionSummary` shape and `toCollectionSummary()` mapper (extracted from `getRecentCollections()`) with the recents query
- Converted `SidebarContent` from a mock-data-driven component into a plain presentational component that receives `itemTypes`, `favoriteCollections`, and `recentCollections` as props — it can no longer fetch data itself since it's rendered inside the client-only `DashboardShell`
- `DashboardShell` now accepts and forwards those three props to both the desktop and mobile-drawer `SidebarContent` instances; `src/app/dashboard/layout.tsx` became an async server component that fetches all three via `Promise.all` and passes them down, with `export const dynamic = "force-dynamic"`
- Item type links use `resolveLucideIcon` and the type's real hex color (matching the pattern already used for collections) instead of the old hardcoded icon/color maps, and link to `/items/[typename]s`
- Recent collections now render a colored circle (`CollectionDot`) keyed to the collection's most-used item type instead of a plain folder icon; favorite collections keep the folder + yellow star treatment
- Added a "View all collections" link below the collections lists, going to `/collections`
- Removed the now-unused mock-backed helpers from `src/lib/dashboard.ts` (kept only `formatRelativeTime`) and trimmed `src/lib/mock-data.ts` down to just `mockUser`/`MockUser` (still used for the sidebar footer pending auth)
- Updated `prisma/seed.ts` to mark two collections (React Patterns, AI Workflows) and three items (`useDebounce Hook`, `Code Review Prompt`, `Kill Process on Port`) as favorites, since no seeded data previously exercised the favorites UI; re-ran `prisma db seed`
- Verified build and lint pass

### 2026-07-23 — Add Pro Badge to Sidebar
- Added a "PRO" badge (ShadCN `Badge`, `variant="outline"`, uppercase, small/subtle styling) next to the Files and Images item type links in the sidebar
- Threaded a new optional `pro` prop through `SidebarContent`'s internal `SidebarLink` component, gated behind the same `!collapsed` branch as the existing item-count `meta`, so it's hidden in the collapsed sidebar state
- Enabled via `pro={type.name === "file" || type.name === "image"}` against the lowercase system type names from `getItemTypes()`
- Visual-only change — no gating/disabling of the Files or Images links, matching the spec's scope
- Verified build, lint, and rendering in the browser via a running dev server (desktop expanded sidebar)

### 2026-07-23 — Code Review Quick Wins
- Ran the `code-scanner` subagent against the full codebase (0 critical, 3 high, 4 medium, 4 low findings) and pulled the lowest-risk items into this feature
- Added `src/lib/db/demo-user.ts` (`DEMO_USER_EMAIL` + `getDemoUser()` wrapped in React's `cache()`) so a single request dedupes the repeated "look up demo user by email" Prisma call; switched all 6 call sites in `src/lib/db/collections.ts` and `src/lib/db/items.ts` to use it
- `getItemTypes()` now runs `itemType.findMany` and `item.groupBy` concurrently via `Promise.all`, and its `!user` fallback branch builds `{ id, name, icon, color, count: 0 }` explicitly instead of spreading the raw Prisma row
- `toItemSummary()` truncates `item.content` to 200 chars before it reaches `ItemCard`'s preview text
- `prisma/seed.ts`'s demo password now reads `process.env.DEMO_USER_PASSWORD ?? "12345678"`, documented in `.env.example`
- Deliberately excluded (higher risk / bigger scope, left for future features): `Suspense` boundaries on `/dashboard` sections, splitting `SidebarContent.tsx`, and replacing the sidebar footer's `mockUser` with the real demo user (pending auth)
- Verified build, lint, and rendering in the browser via a running dev server — confirmed real seeded data (e.g. React Patterns collection) still renders correctly

### 2026-07-23 — Auth Phase 1 - NextAuth + GitHub Provider
- Installed `next-auth@5.0.0-beta.32` and `@auth/prisma-adapter`
- Added `src/auth.config.ts` (edge-compatible: GitHub provider only) and `src/auth.ts` (full config: `PrismaAdapter` over the existing `src/lib/prisma.ts` singleton, `jwt` session strategy, callbacks propagating `user.id` onto the token and session)
- Added `src/app/api/auth/[...nextauth]/route.ts` exporting `GET`/`POST` handlers from `src/auth.ts`
- Added `src/proxy.ts`: matches `/dashboard/:path*`, redirects unauthenticated requests to `/api/auth/signin` with a `callbackUrl` back to the original path; uses the named `proxy` export per Next.js 16 convention
- Added `src/types/next-auth.d.ts` extending `Session.user` with `id: string`
- Documented `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` in `.env.example` (real values already present in local `.env`)
- Used NextAuth's default sign-in page (no custom `pages.signIn`), per spec
- Verified build and lint pass; verified in the browser via the running dev server that `/dashboard` redirects to the default sign-in page and that clicking "Sign in with GitHub" redirects to GitHub's real OAuth authorize screen with the correct `client_id`/callback URL
- Did not complete a full GitHub login round-trip (requires the user's own GitHub credentials) — OAuth wiring verified up to GitHub's authorize page
