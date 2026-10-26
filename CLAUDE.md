# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev`: dev server at http://localhost:3000 (Turbopack)
- `npm run build`: production build
- `npm run start`: serve the production build
- `npm run lint`: ESLint (flat config with `eslint-config-next` core-web-vitals + typescript rules)
- `npx tsc --noEmit`: type-check (there is no dedicated script)

No test framework is set up yet.

## Stack

Next.js 16.4 (App Router), React 19.3, TypeScript (strict), Tailwind CSS v4. This is still the create-next-app scaffold; the only source files are `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/globals.css`.

## Architecture notes

- **App Router under `src/app/`**. The README says `app/page.tsx`, but the real path is `src/app/page.tsx`. The import alias `@/*` maps to `./src/*`.
- **Cache Components is on** (`cacheComponents: true` + `partialPrefetching: true` in `next.config.ts`). This changes how rendering works compared with older Next.js:
  - Data fetching is dynamic by default. Opt into caching with the `use cache` directive, plus `cacheLife`/`cacheTag`. Route segment configs such as `dynamic`, `revalidate`, and `runtime` don't apply here. Don't add a `runtime` export, since Cache Components requires the Node.js runtime.
  - Partial Prerendering is the default: a static shell is prerendered and dynamic parts stream in, so dynamic data access has to sit inside `<Suspense>` boundaries.
  - Links prefetch one shared App Shell per route. To also prefetch URL-dependent data, use `<Link prefetch={true}>`.
  - Navigation keeps previous routes mounted under React `<Activity mode="hidden">`, which preserves state; effects are cleaned up and re-run.
  - Before changing caching or data-fetching code, read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` and `.../03-api-reference/05-config/01-next-config-js/cacheComponents.md`.
- **Tailwind v4 runs through a Turbopack loader**, not PostCSS. There is no `postcss.config` or `tailwind.config`. `next.config.ts` routes `*.css` through `@tailwindcss/turbopack`. Theme tokens live in `globals.css` via `@theme inline`, and light/dark colors are CSS variables (`--background`, `--foreground`) switched by `prefers-color-scheme`.
- **Typed route props**: the root layout uses the global `LayoutProps<"/">` helper type (generated into `.next/types`), not hand-written prop types. Use `LayoutProps`/`PageProps` the same way in new routes.
- Fonts: Geist and Geist Mono load via `next/font/google` in the root layout and are exposed as `--font-geist-sans`/`--font-geist-mono`. They map to Tailwind's `font-sans`/`font-mono`.
