# Odoratus — Storefront

An independent olfactory house storefront: browse fragrances, inspect a
composition, choose a bottle size and build an order.

Built for the Digitera Frontend Engineering Bootcamp.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** — design tokens declared in `src/app/globals.css`
- **TanStack Query** for server state, **Zustand** for the cart
- **Jest** + Testing Library for unit tests, **Cypress** for end-to-end
- **pnpm** as the package manager

No icon, animation or UI-component library. Icons are hand-drawn SVG
components in `src/components/icons/`; motion is CSS keyframes.

## Prerequisites

- Node.js 20 or newer
- pnpm 10 (`npm install -g pnpm`)

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The app runs on http://localhost:3000 and redirects to `/products`.

## Commands

```bash
pnpm dev           # development server
pnpm build         # production build
pnpm start         # serve the production build
pnpm typecheck     # tsc --noEmit
pnpm lint          # eslint
pnpm test          # jest
pnpm cypress:open  # end-to-end tests, interactive
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_USE_MOCK_API` | `true` (default) serves the in-memory catalog. `false` calls the HTTP API. |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL used when mock data is disabled. |

Never put a secret in a `NEXT_PUBLIC_*` variable — it is exposed to the browser.

## Architecture

```text
src/
├── app/                  # routes, layouts, loading/error/not-found
├── components/
│   ├── icons/            # hand-drawn SVG icon components
│   ├── shared/           # header, footer, announcement bar, navigation
│   └── ui/               # Button, Badge, Skeleton, Switch, QuantityStepper…
├── features/
│   ├── products/         # components, hooks, services, types, utils
│   └── cart/             # components, hooks, store, types, utils
├── lib/                  # api client, query client, helpers
└── config/               # public environment configuration
```

**Features own their implementation. Shared code stays minimal and genuinely
reusable.** A feature never imports another feature's internals — only its
`index.ts`. See `docs/FEATURE_OWNERSHIP.md` for the full map.

## Development guidelines

- Server Components by default; `"use client"` only on interactive leaves.
- Search, filters, sort and pagination live in the URL, never in component state.
- ~200 lines per file is the review threshold. Past it, extract hooks and
  helpers; if it is still large, give the component its own folder.
- Every interactive element must be keyboard operable with a visible focus ring.
- Images go through `next/image`, are lazy loaded off-screen and carry real
  `alt` text.
- Run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before pushing.

`docs/AGENT_RULES.md` holds the same rules in the form AI coding agents should
be given at the start of a task.
