# Odoratus — Storefront

A luxury perfume storefront: browse a catalogue, read a composition, choose a
bottle size, and place an order. Bilingual (English / العربية) with full RTL,
a light and a dark theme, and every icon drawn by hand.

Built for the **Digitera Frontend Engineering Bootcamp** (iCareer × EraaSoft)
from a Figma design, starting from requirements gathered with the client and a
backlog of epics and user stories.

**What a customer can do:** browse, search, filter (category, occasion, scent
family, price) and sort the catalogue · pick a bottle size and gift wrapping ·
manage a bag · check out **as a guest** and send the order through WhatsApp ·
save fragrances to a wishlist · read client reviews and ratings · read the FAQ
· reach the house by WhatsApp, phone, email or the contact form · optionally
create an account to see their orders on any device · use the whole site in
Arabic or English.

**What the owner can do** (in the Sanity dashboard, `dashboard/`): add, edit and
remove products · change prices per size · mark products or single sizes as
available / out of stock · edit the Arabic copy · see new orders and customers ·
manage contact-form inquiries · approve reviews.

**Live:** [https://digiterafrontend.vercel.app/](https://digiterafrontend.vercel.app/)

**Try it with the demo account** — sign in at `/login`:

| Email                | Password            |
| -------------------- | ------------------- |
| `demo@odoratus.test` | `OdoratusDemo2026!` |

It is shared by everyone, so its name and email are locked, and anything you
type there is visible to the next visitor — use made-up details. Orders open
WhatsApp on a placeholder number, so nothing reaches the shop. The owner
dashboard is private; screenshots and the walkthrough video show it.

---

## Running it

```bash
pnpm install
cp .env.example .env.local     # optional — the defaults run on mock data
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
| `pnpm test`                 | Jest unit tests                                  |
| `pnpm test:e2e`             | Cypress, headless (needs the dev server running) |
| `pnpm format`               | Prettier over the repo                           |

---

## Tech

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** strict
- **Tailwind CSS 4** — semantic tokens declared in `src/app/globals.css`
- **TanStack Query** for catalogue data, **Zustand + persist** for the bag,
  the session and the order history
- **Jest** + Testing Library · **Cypress** for end-to-end
- **Sanity** for the owner's dashboard — the storefront talks to it over plain
  HTTP (`src/lib/sanity/client.ts`), so it adds no SDK to the bundle

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
    wishlist/              saved fragrances (ids only, prices stay live)
    reviews/               ratings and client reviews on the product page
    faq/                   the questions page
    inquiries/             the contact form, shared validation with the API
  lib/
    i18n/                  dictionaries, provider, server-side preference read
    theme/                 light / dark provider
    utils/
```

Importing `@/features/cart/store/cart.store` from another feature is a
violation; import from `@/features/cart` instead. `docs/FEATURE_OWNERSHIP.md` maps
every feature and user story to the code that implements it.

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
the payment method — addressed to the number in `NEXT_PUBLIC_WHATSAPP_NUMBER`. When that is unset
it goes to a placeholder line (`ORDER_WHATSAPP_FALLBACK`), so orders placed by
visitors testing the demo never reach a real phone. The house's public contact
line (WhatsApp button, calls) lives in `src/config/contact.ts`. The
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

**Checkout does not need an account.**
The brief says customers must be able to order without registering, so the
checkout is open to guests. Signing in is optional: it prefills the form and
keeps an order history on the account page.

**One data layer, two sources.**
`NEXT_PUBLIC_USE_MOCK_API` (default `true`) keeps the site on the in-repo
catalogue so it runs with zero setup. Set it to `false` with a Sanity project id
and products and reviews come from the owner's dashboard instead. Both sources
feed the same tested filtering, sorting and paging code
(`products.in-memory.ts`), so the listing behaves identically either way.

**Orders, inquiries and reviews reach the owner; the token never reaches the browser.**
Three route handlers in `src/app/api/` (`orders`, `inquiries`, `reviews`) accept
the website's submissions and write them to Sanity with a server-only token.
Nothing from the browser is trusted: an order's prices and stock are re-checked
against the live catalogue and its totals recomputed on the server, and new
reviews stay hidden until the owner approves them.

**The dataset is private; the browser only ever talks to our own API.**
Customers, orders and messages live in Sanity, so the dataset is private and
every read and write goes through route handlers in `src/app/api/` that hold
the token: `products`, `reviews`, `orders`, `inquiries` and `auth`. Pages are
rendered on the server with their data already in them.

**Accounts are optional but real.** Guests can order without one, as the brief
asks. With an account, the password is stored only as a salted scrypt hash, the
session is a signed, httpOnly, SameSite cookie (`AUTH_SECRET`), sign-in answers
the same way for an unknown email and a wrong password, and orders placed while
signed in are linked to the account and listed on the account page from any
device. Password-reset emails need an email service and are not switched on;
the reset page tells people to message the shop instead.

**No payment is taken.** Payment is a choice of method, settled on WhatsApp; no
card details exist anywhere in the code. `/pages/privacy` lists everything that
is stored and where.

**Demo mode.** With `NEXT_PUBLIC_USE_MOCK_API=true` (the default) there is no
database: the catalogue is in the repo, accounts and orders stay in the
browser, and the sign-in screens say so plainly.

---

## What is covered by tests

`pnpm test` — unit tests over the logic that is easy to get quietly wrong:
cart maths and gift-wrapping thresholds, query parsing, filtering, sorting and
pagination, both validation suites, price formatting, and a suite that guards
the catalogue's shape (24 products, four full pages, unique ids and SKUs, every
price inside the slider's range, no photograph repeated on one page), the
invoice the WhatsApp link carries, the return-path sanitiser, the wishlist
store, review averages, contact-form validation and the mapping of dashboard
documents onto products.

`pnpm test:e2e` — Cypress specs for the journeys that matter: browsing and
filtering, the full product → bag → checkout → confirmed order path, the
session surviving a reload, sign-out, the guarded routes, the editorial pages,
switching language and theme, the wishlist, reviews, FAQ and the contact form.

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
build command is `pnpm build`, and no environment variables are required — the
site runs on mock data.

To make it a full live shop with a database — orders, inquiries and reviews
saved, products managed by the owner — follow **Going live** in
[`dashboard/README.md`](dashboard/README.md). That also publishes the owner's
dashboard at its own address (`https://odoratus-dashboard.sanity.studio`).

The deployed project is available at: [https://digiterafrontend.vercel.app/](https://digiterafrontend.vercel.app/)

---

## Credits

Design: Digitera bootcamp Figma file. Product photography is placeholder
imagery; nine photographs are shared across the twenty-four fragrances.
