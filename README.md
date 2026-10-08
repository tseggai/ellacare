# EllaCare website

This is a rebuild of ellacare.com, the site for an adult family home in Lynnwood, WA. It runs on **Next.js 16 + Tailwind CSS 4** and is hosted on **Vercel**. **Supabase** stores tour requests, callback requests and questions.

- All business info and copy: [`src/lib/site.ts`](src/lib/site.ts). Change it there and every page updates.
- Content extracted from the old site: [`docs/content-inventory.md`](docs/content-inventory.md)
- Database schema: [`supabase/migrations/`](supabase/migrations)

## Pages

| Route | Replaces old URL |
| --- | --- |
| `/` (home, testimonials, FAQ) | `/`, `/testimonials` |
| `/about` | `/about-us` |
| `/services` | `/services` |
| `/residences` (photo gallery + lightbox) | `/residences` |
| `/dining` | `/menus` |
| `/activities` | `/activities` |
| `/safety` | `/security`, `/policy` |
| `/contact` (tour request form + map) | `/contact-us` |
| `/privacy` | `/privacy` |

Old URLs permanently redirect to the new ones (see `next.config.ts`), so existing links and Google rankings carry over.

## Setup

### 1. Supabase (about 5 min)

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard). Pick a West US region.
2. Open **SQL Editor**, paste the contents of `supabase/migrations/20261008000000_inquiries.sql`, and click **Run**.
3. Go to **Project Settings → API Keys** and copy:
   - the **Project URL** → `SUPABASE_URL`
   - a **Secret key** (`sb_secret_…`, or the legacy `service_role` key) → `SUPABASE_SECRET_KEY`

New submissions show up in **Table Editor → inquiries**. The `type` column says whether each one is a `tour`, a `callback` (name and phone only, from the home page) or a `question`. Use the `status` column (`new`, `contacted`, `toured`, `closed`) to track follow-up.
Row-level security is on and there are no public policies, so only the server (which holds the secret key) can write to the table, and the browser can't read it.

### 2. Vercel (about 5 min)

1. At [vercel.com/new](https://vercel.com/new), import the `tseggai/ellacare` GitHub repo. Vercel detects Next.js automatically; keep the defaults.
2. Under **Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | from step 1 |
   | `SUPABASE_SECRET_KEY` | from step 1 |
   | `NEXT_PUBLIC_SITE_URL` | `https://ellacare.com` |
   | `RESEND_API_KEY` | *optional*: emails you each new inquiry |
   | `INQUIRY_NOTIFY_EMAIL` | *optional*: where to send them (comma-separated) |
   | `INQUIRY_FROM_EMAIL` | *optional*: verified sender, e.g. `EllaCare <web@ellacare.com>` |

3. Click **Deploy**.
4. **Domain:** go to Project → Settings → Domains, add `ellacare.com` and `www.ellacare.com`, then add the DNS records Vercel shows at your registrar.

### Email notifications (optional, recommended)

Sign up at [resend.com](https://resend.com), verify the `ellacare.com` domain, create an API key, and set the three optional variables above. Without them, inquiries are still saved to Supabase.

## Local development

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # http://localhost:3000
npm run lint && npm run build
```
