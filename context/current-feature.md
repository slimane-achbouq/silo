# Current Feature

## Status

Completed

## Goals

Replace the dummy collection data displayed in the main area of the dashboard (right side) with real data from the database, per `context/features/dashboard-collections-spec.md`.

- Create `src/lib/db/collections.ts` with data fetching functions
- Fetch collections directly in the server component (no client-side fetching)
- Replace usage of `src/lib/mock-data.ts` on the dashboard with real Prisma-backed data from Neon
- Keep the current design: 6 cards of recent collections, same layout as today
- Derive collection card border color from the most-used content type in that collection
- Show small icons of all item types present in that collection
- Update the collection stats display
- Do NOT add the items list underneath the cards yet — that comes in a later feature

## Notes

- References: `context/features/dashboard-collections-spec.md` (full spec), `context/project-overview.md` (data models), `context/coding-standards.md` (database standards)
- Reference screenshot: `context/screenshots/dashboard-ui-main.png` if needed, though layout/design already exists and should be preserved

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
