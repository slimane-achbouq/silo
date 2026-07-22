# Current Feature

## Status

<!-- Not Started | In Progress | Completed -->

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

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
