# Silo

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files 

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md


## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.10** with **React 19.2.4** — versions differ significantly from training data; read `node_modules/next/dist/docs/` before writing Next.js-specific code
- **TypeScript 5** — strict mode via `tsconfig.json`
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css` and `postcss.config.mjs`; v4 has breaking changes from v3 (no `tailwind.config.js`, utility-first CSS-based config)
- **ESLint 9** — flat config in `eslint.config.mjs`

## Project Structure

```
src/app/          # Next.js App Router root
  layout.tsx      # Root layout with Geist fonts
  page.tsx        # Home page
  globals.css     # Global styles (Tailwind v4 import)
next.config.ts    # Next.js configuration
```

The project is in early setup — only the root route exists.
