# EllaCare website

This is a rebuild of ellacare.com, the site for an adult family home in Lynnwood, WA. It runs on **Next.js 16 + Tailwind CSS 4** and is hosted on **Vercel**. **Supabase** stores tour requests, callback requests and questions.

- All business info and copy: [`src/lib/site.ts`](src/lib/site.ts). Change it there and every page updates.
- Content extracted from the old site: [`docs/content-inventory.md`](docs/content-inventory.md)
- Database schema: [`supabase/migrations/`](supabase/migrations)

## Pages

| Route | Replaces old URL |
| --- | --- |
| `/` (home, featured testimonial, FAQ) | `/` |
| `/about` | `/about-us` |
| `/services` | `/services` |
| `/residences` (photo gallery + lightbox) | `/residences` |
| `/dining` | `/menus` |
| `/activities` | `/activities` |
| `/safety` | `/security`, `/policy` |
| `/testimonials` (from Supabase) | `/testimonials` |
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

#### Adding a testimonial

Open **Table Editor → testimonials** and click **Insert row**:

| Column | What to put |
| --- | --- |
| `author` | Name as it should appear, e.g. `Carol DeQuoy` |
| `relation` | Optional, e.g. `Daughter of a resident` |
| `quote` | The full testimonial |
| `highlight` | Optional short pull-quote (one sentence) shown large on cards |
| `published` | Untick to hide it without deleting |
| `sort_order` | Lower numbers show first; the lowest is the featured story on the home page |

The website checks for changes once an hour, so a new story appears within the hour. To see it sooner, redeploy in Vercel.

### Staff admin area (`/admin`)

Staff sign in at **/admin** with a one-time email link and can:
- see every inquiry (tour requests, callbacks, questions), change its status and keep notes;
- add, edit, hide or delete testimonials; changes appear on the site immediately.

Setup:
1. Add `SUPABASE_PUBLISHABLE_KEY` (Supabase → Project Settings → API Keys → *Publishable key*) to Vercel.
2. In Supabase → **Authentication → URL Configuration**, set **Site URL** to the site's address and add `https://<your-domain>/auth/callback` to **Redirect URLs** (for both the Vercel address and ellacare.com).
3. Allowed sign-in addresses are listed in `src/lib/admin.ts`; override without a code change by setting `ADMIN_EMAILS=a@example.com,b@example.com` in Vercel.

Supabase's built-in email sender is rate-limited to a few sign-in links per hour, which is fine for a small team. If that ever gets in the way, point Supabase Auth at a custom SMTP provider (e.g. Resend) under Authentication → Emails.

### 2. Vercel (about 5 min)

1. At [vercel.com/new](https://vercel.com/new), import the `tseggai/ellacare` GitHub repo. Vercel detects Next.js automatically; keep the defaults.
2. Under **Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | from step 1 |
   | `SUPABASE_SECRET_KEY` | from step 1 |
   | `SUPABASE_PUBLISHABLE_KEY` | from step 1; needed for staff sign-in to `/admin` |
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
