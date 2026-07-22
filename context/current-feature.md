# Current Feature

## Status

Completed

## Goals

Create a seed script to populate the database with sample data for development and demos (see `context/features/seed-spec.md`).

- Add `prisma/seed.ts` and wire it up as the Prisma seed entry point
- Seed a demo `User` (slach@dev.io, "Demo User", password hashed with bcryptjs at 12 rounds, `isPro: false`, `emailVerified` set to current date)
- Seed the 7 system `ItemType` rows (snippet, prompt, command, note, file, image, link) with their Lucide icon names and colors, `isSystem: true`
- Seed 5 collections with items as specified in `context/features/seed-spec.md`: React Patterns (3 snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 links), Terminal Commands (4 commands), Design Resources (4 links)
- Use real, valid URLs for link items

## Notes

- References: `context/features/seed-spec.md` (full data spec), `context/project-overview.md` (data models), `context/coding-standards.md` (database standards)
- Seed script should be idempotent/safe to re-run against the dev database (e.g. upsert on unique fields) since it will be run repeatedly during development

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
