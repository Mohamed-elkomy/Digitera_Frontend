# Odoratus Dashboard

The business owner's dashboard, built with [Sanity Studio](https://www.sanity.io/).
Sanity is also the shop's backend: its hosted database stores products,
orders, reviews and inquiries, and the website reads and writes it through its
HTTP API.

From the dashboard the owner can:

- see **new orders** placed on the website and move them New → Confirmed → Delivered
- see the **customers** who created an account (passwords are stored only as hashes and never shown)
- edit the **Arabic copy** of each product (the *العربية* tab)
- add, edit and remove products, change prices per bottle size
- mark a product (or a single size) as available or out of stock
- read and manage contact-form **inquiries** (New → Replied → Closed)
- approve the **reviews** customers write before they appear on the site

## Going live (one time, about 15 minutes)

Run everything from this `dashboard/` folder.

1. **Create the project.** Sign in at [sanity.io/manage](https://www.sanity.io/manage),
   click **Create project**, name it `Odoratus`. Then, under **Datasets**, make
   the `production` dataset **Private** — it holds customers, orders and
   messages. Copy the **Project ID**.

2. **Point the dashboard at it.** Copy `.env.example` to `.env` and paste the id:

   ```bash
   SANITY_STUDIO_PROJECT_ID=abc123de
   ```

3. **Install, log in and load the catalogue.**

   ```bash
   pnpm install
   npx sanity login
   pnpm seed        # 24 products with photos, taxonomies, approved reviews
   pnpm cors        # lets the dashboard run locally on localhost:3333
   pnpm api-token   # prints the server token — copy it, it is shown only once
   ```

4. **Publish the dashboard.**

   ```bash
   pnpm deploy-dashboard      # → https://odoratus-dashboard.sanity.studio
   ```

   If that name is taken, change `studioHost` in `sanity.cli.ts` and run it again.

5. **Switch the website to live data.** On Vercel → your project → Settings →
   Environment Variables, add (for Production, Preview and Development):

   | Name                            | Value                        |
   | ------------------------------- | ---------------------------- |
   | `NEXT_PUBLIC_USE_MOCK_API`      | `false`                      |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | your project id              |
   | `NEXT_PUBLIC_SANITY_DATASET`    | `production`                 |
   | `SANITY_API_WRITE_TOKEN`        | the token from `pnpm api-token`        |
   | `AUTH_SECRET`                   | 32+ random characters (below) |

   Make the secret with:
   `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`

   Then **Deployments → ⋯ → Redeploy**. Public variables are baked in at build
   time, so the redeploy is required.

6. **Check it.** Create an account, place an order, send the contact form and
   write a review on the live site — they appear in the dashboard under
   *Customers*, *New orders*, *New inquiries* and *Reviews awaiting approval*,
   and the order shows on the account page from any device.

The browser never talks to Sanity directly: every read and write goes through
the website's own `/api` routes, which hold the token. That is why the dataset
can stay private and why no CORS entry is needed for the live site.

**Password reset emails** are not switched on — they need an email service
(for example Resend). Until then the reset page asks customers to message the
shop on WhatsApp.

## Backup and recovery

```bash
pnpm backup    # whole dataset (documents + images) -> ../backups/odoratus-backup.tar.gz
pnpm restore   # puts that backup back, replacing what is there
```

Run `pnpm backup` before any bulk change and on a regular schedule, and keep
copies outside the project folder (`/backups` is git-ignored because it holds
customer orders). Besides that, Sanity keeps a revision history for every
document (restore a single product from its *History* panel), Vercel can roll
the website back to any previous deployment in one click, and the code itself
lives in Git.

## Who can open the dashboard

The dashboard address is public, but only members of the Sanity project can
sign in. Add people in sanity.io/manage → Members. To show it off (for example
in a LinkedIn post), use screenshots or a short screen recording.
