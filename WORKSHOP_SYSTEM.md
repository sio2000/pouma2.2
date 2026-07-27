# Workshop Marketing System

A complete, production-ready system to promote workshops, capture leads, register
participants, send confirmation emails, and manage everything from the existing
admin panel. Supports **unlimited** workshops with an automatic lifecycle
(`upcoming → live → completed`) computed from each workshop's date/time.

---

## 1. Data layer — works with zero config, upgrades to Supabase

The system uses a **provider abstraction** (mirroring the email design below):

| Backend | When it's used | Notes |
| --- | --- | --- |
| **Supabase** (Postgres) | When `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set | Real tables, indexes, FK cascade, unique-email constraint, RLS |
| **Netlify Blobs / JSON** (default) | When Supabase env is **not** set | The project's native store (`workshops.json`, `workshop-registrations.json`) — same as resources/contacts |

You don't have to do anything to run it: with no Supabase env, it uses the Blobs
store and works immediately (local disk in dev, Netlify Blobs in production).

### Enabling Supabase (recommended for production)

1. Create a Supabase project.
2. Run the migration in `supabase/migrations/0001_workshop_marketing_system.sql`
   (via `supabase db push`, or paste it into the Supabase SQL editor).
3. Set the environment variables (below) and redeploy.

All DB access is **server-side with the service-role key** (which bypasses RLS).
RLS is enabled with no public policies, so the tables are locked down by default.

---

## 2. Email — Resend ready, SMTP ready, console fallback

Provider is chosen by `EMAIL_PROVIDER`, or auto-detected:
`Resend (if RESEND_API_KEY) → SMTP (if SMTP_*) → console`.

- **Resend** — called via the REST API (no SDK dependency). Set `RESEND_API_KEY` + `EMAIL_FROM`.
- **SMTP** — uses `nodemailer`, loaded lazily. Run `npm i nodemailer` and set the `SMTP_*` vars.
- **console** — default fallback. Logs the email and records the registration's
  `email_status` as `skipped` (nothing is delivered). Lets the whole flow work
  before any provider is configured.

Only the **registration confirmation** email is sent automatically. Per spec, the
**workshop access link is sent manually by the admin** in a second email — the
system never sends it.

---

## 3. Environment variables

Add these to `.env.local` (dev) and your Netlify environment (prod). All are
**optional** — omit them to use the Blobs store + console email.

```bash
# ── Supabase (optional — enables the Postgres backend) ──
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# NEXT_PUBLIC_SUPABASE_URL is also accepted for the URL.

# ── Email provider (optional) ──
EMAIL_PROVIDER=          # resend | smtp | console  (blank = auto-detect)
EMAIL_FROM="The Pouma Academy <hello@your-domain.gr>"
EMAIL_REPLY_TO=ask@thepoumaacademy.com

# Resend
RESEND_API_KEY=

# SMTP (requires `npm i nodemailer`)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
```

Admin auth (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) is unchanged
and already powers the existing admin panel.

---

## 4. Public routes

| Route | Description |
| --- | --- |
| `/{locale}/workshop/{slug}` | Workshop landing page (hero, countdown, benefits, what-you'll-learn, registration form, FAQ, CTA). SEO + Event JSON-LD. |
| `/{locale}/workshop/{slug}/thank-you` | Confirmation page after a successful registration. |

`{locale}` is `el` (default) or `en`. A bare `/workshop/{slug}` redirects to the
default-locale URL via the existing i18n middleware.

A conversion popup (nearest upcoming active workshop) appears site-wide after 10s,
hides for 24h when dismissed, and never shows on a workshop page or after a
successful registration.

## 5. API routes

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/workshops?scope=featured` | public | Nearest upcoming active workshop (popup) |
| GET | `/api/workshops?scope=all` | admin | All workshops + registration counts |
| POST | `/api/workshops` | admin | Create (multipart with banner) |
| PATCH | `/api/workshops/{id}` | admin | Update |
| DELETE | `/api/workshops/{id}` | admin | Delete (cascades registrations + banner) |
| GET | `/api/workshops/{id}/registrations` | admin | Participant list |
| POST | `/api/workshops/register` | public | Register (honeypot, rate-limit, Zod, duplicate check, email) |

## 6. Admin

Admin panel → **Workshops** tab:

- Create / edit / delete workshops (title, subtitle, description, banner, slug,
  date, time, duration, active).
- Status filter: **Ενεργά** (upcoming + live), **Ολοκληρωμένα** (completed), **Όλα**.
  Completed workshops are hidden from the active view but their data is retained
  and remains exportable.
- Per-workshop **Συμμετοχές** modal: searchable, paginated participant list with
  **Export emails** (CSV), **Copy emails** (clipboard), and **Export all** (CSV).

## 7. Security

Zod validation • server-side sanitisation (XSS) • honeypot field • per-IP rate
limiting • duplicate-email protection (DB unique index + in-code check) •
GDPR consent stored with a timestamp • plain-text rendering (no `dangerouslySetInnerHTML`).
