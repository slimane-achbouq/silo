# Current Feature

## Status

Completed

## Goals

Set up Prisma ORM with Neon PostgreSQL database (see `context/features/database-spec.md`).

- Use Neon PostgreSQL (serverless)
- Use Prisma 7 (breaking changes vs earlier versions - read upgrade guide before implementing)
- Create initial schema based on data models in `context/project-overview.md` (schema will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Always use migrations (`prisma migrate dev`), never `db push`, except when explicitly specified

## Notes

- Development branch DB will be set via `DATABASE_URL`; a separate production branch will exist
- References: `context/project-overview.md` (data models), `context/coding-standards.md` (database standards), Prisma docs (prisma.io/docs), Prisma 7 upgrade guide

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
