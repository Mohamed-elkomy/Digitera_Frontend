# Odoratus — Storefront

A luxury perfume storefront: browse a catalogue, read a composition, choose a
bottle size, and place an order. Bilingual (English / العربية) with full RTL,
a light and a dark theme, and every icon drawn by hand.

Built for the **Digitera Frontend Engineering Bootcamp** from a Figma design.

**Live:** [https://digiterafrontend.vercel.app/](https://digiterafrontend.vercel.app/)

---

## Running it

```bash
pnpm install
cp .env.example .env.local     # then put your own WhatsApp number in it
pnpm dev                       # http://localhost:3000
```

> This project uses **pnpm**. Running `npm install` creates a `package-lock.json`
> that conflicts with `pnpm-lock.yaml`, and the lockfiles then disagree about
> versions.

| Script                      | What it does                                     |
| --------------------------- | ------------------------------------------------ |
| `pnpm dev`                  | Dev server (Turbopack)                           |
| `pnpm build` / `pnpm start` | Production build and server                      |
| `pnpm typecheck`            | `tsc --noEmit`, strict mode                      |
| `pnpm lint`                 | ESLint, including the React Compiler rules       |
| `pnpm test`                 | Jest — 114 unit tests                            |
| `pnpm test:e2e`             | Cypress, headless (needs the dev server running) |
| `pnpm format`               | Prettier over the repo                           |

---

## Tech

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** strict
- **Tailwind CSS 4** — semantic tokens declared in `src/app/globals.css`
- **TanStack Query** for catalogue data, **Zustand + persist** for the bag,
  the session and the order history
- **Jest** + Testing Library · **Cypress** for end-to-end

No icon library, no animation library, no component library. Every icon in
`src/components/icons/` is hand-written SVG, and every transition is CSS.

---

## Architecture

**Feature-Sliced**, not Atomic Design. A feature owns its components, hooks,
services, types and utils, and the outside world only reaches it through its
`index.ts`:

```
src/
  app/                     routes only — each page delegates to a feature
  components/
    icons/                 hand-drawn SVG, grouped by use
    shared/                header, footer, search overlay, account menu
    ui/                    Button, Input, Skeleton, BottleLoader…
  features/
    products/              catalogue, filtering, detail page
    cart/                  the bag and its maths
    checkout/              shipping form, order placement, order history
    auth/                  sign-in, registration, session, account page
    content/               the editorial pages behind the footer links
    home/                  the landing sections
  lib/
    i18n/                  dictionaries, provider, server-side preference read
    theme/                 light / dark provider
    utils/
```

Importing `@/features/cart/store/cart.store` from another feature is a
violation; import from `@/features/cart` instead. `docs/AGENT_RULES.md` has the
full set of rules the project is held to.

**No file exceeds 200 lines.** Where one would, it becomes a folder of its own
name split into parts — see `src/features/checkout/components/CheckoutPage/`
and `src/lib/i18n/dictionaries/`.

---

## Decisions worth explaining

**Language and theme are read on the server, from cookies.**
`src/lib/i18n/server.ts` reads them in the root layout, so `<html lang dir
data-theme>` is correct in the very first byte. No flash of the wrong theme, no
hydration mismatch. The cost is that pages render dynamically (`ƒ`) rather than
statically — a deliberate trade for correctness.

**The URL is the single source of truth for the listing.**
Search, filters, sort and page all live in the query string, so a filtered view
can be bookmarked, shared and reloaded. No filter state is duplicated in React.

**Errors are stored as keys, not sentences.**
A validation failure is held as `"emailInvalid"`, and the sentence is produced
at render time. Switching language re-translates an error already on screen
instead of leaving an English message under an Arabic label.

**Product copy is resolved at render time too.**
The catalogue holds one canonical record per product; Arabic names, notes and
descriptions live in `src/lib/i18n/dictionaries/products/`. Ids, categories and
scent families are never translated, only what a customer reads.

**The catalogue has 24 products because the design does.**
The Figma listing shows "24 FRAGRANCES AVAILABLE" and four pages. The six
products the task brief pins down are isolated in `products.mock-data/core-six.ts`
and left exactly as specified; the other eighteen are grouped by store category.

**WhatsApp is the order pipeline.**
With no server to post to, a confirmed order would otherwise go nowhere. So
placing one opens WhatsApp with the order laid out as an invoice — number,
date, each line with its size and total, the charges, the delivery address and
the payment method — addressed to the number in `NEXT_PUBLIC_WHATSAPP_NUMBER`.
Leave that unset and the WhatsApp step disappears instead of breaking. The
window is opened inside the click handler, not after the simulated latency, or
the browser would treat it as a pop-up and block it.

Keeping the number in an environment variable keeps it out of the repository
and out of the git history. It does **not** keep it out of the browser: a
front-end has to know the number to build the link, so anyone can read it in
devtools. There is no way around that without a backend.

**Signing in resumes what you were doing.**
Being bounced to the sign-in page carries `?next=` with the path you wanted, so
you land back on checkout rather than on the account page. Only same-site paths
are honoured — `sanitiseReturnPath` rejects anything absolute or
protocol-relative, because an unchecked redirect is a real vulnerability.

**There is no backend, and the UI says so.**
Sign-in accepts anything, orders are written to browser storage, and no payment
is taken. Rather than hide that, the auth and checkout screens state it plainly
and tell people not to enter a real password. `/pages/privacy` lists everything
that is stored and where.

**Known limitation:** because the session lives in `localStorage`, it is not
real authentication — anyone can edit it in the devtools. That is acceptable for
a front-end demonstration and would be replaced by a server-issued, httpOnly
session cookie in a real build.

---

## What is covered by tests

`pnpm test` — 114 unit tests over the logic that is easy to get quietly wrong:
cart maths and gift-wrapping thresholds, query parsing, filtering, sorting and
pagination, both validation suites, price formatting, and a suite that guards
the catalogue's shape (24 products, four full pages, unique ids and SKUs, every
price inside the slider's range, no photograph repeated on one page), the
invoice the WhatsApp link carries, and the return-path sanitiser.

`pnpm test:e2e` — Cypress specs for the journeys that matter: browsing and
filtering, the full product → bag → checkout → confirmed order path, the
session surviving a reload, sign-out, the guarded routes, the editorial pages,
and switching language and theme.

---

## Accessibility and responsiveness

Verified at 320, 360, 390, 414, 768, 1024, 1280 and 1440 px, in both themes and
both languages, with no horizontal overflow at any width.

Menus and overlays close on `Escape` and return focus to what opened them.
Every form field is labelled and wired to its error through `aria-describedby`.
Colour never carries meaning alone — the password meter shows a word as well as
bars. `prefers-reduced-motion` is honoured.

---

## Deploying

```bash
pnpm build          # verify it passes locally first
```

Then on [vercel.com](https://vercel.com): **Add New → Project**, import this
repository, and deploy. The defaults are correct — Next.js is detected, the
build command is `pnpm build`, and there are no environment variables, because
there is no backend to point at.

The deployed project is available at: [https://digiterafrontend.vercel.app/](https://digiterafrontend.vercel.app/)

---

## Credits

Design: Digitera bootcamp Figma file. Product photography is placeholder
imagery; nine photographs are shared across the twenty-four fragrances.
