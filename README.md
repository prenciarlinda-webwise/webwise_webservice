# Web Wise

SEO agency platform for service businesses (plumbers, roofers, HVAC, painters, etc.) in the US/UK.

- **Marketing site** — Next.js 16 + TypeScript, static-first
- **Backend** — Django 6 + DRF + Postgres + Celery + Channels (websockets)
- **Dashboard** — role-based (admin, supervisor, economist, employee, client) for managing clients, projects, deliverables, payments, and SEO data (DataForSEO)

## Quick start

```bash
# Frontend
npm install
npm run dev              # http://localhost:3000

# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # fill in DJANGO_SECRET_KEY, DataForSEO creds, etc.
python manage.py migrate
python manage.py runserver  # http://localhost:8000

# Celery (in a second terminal)
celery -A config worker -l info
celery -A config beat -l info
```

## Required environment variables

**Frontend (`.env.local`):**
- `NEXT_PUBLIC_API_URL` — backend base, default `http://localhost:8000/api`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
- `INDEXNOW_API_KEY`

**Backend (`backend/.env`):**
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`
- `DATABASE_URL` — Postgres connection string
- `REDIS_URL` — Celery broker
- `CORS_ALLOWED_ORIGINS` — frontend origin
- `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`

## Seeding a fresh server

```bash
cd backend

# 8 real clients + Zelo Flooring's 3-month SEO plan
python manage.py seed_initial_data

# Also create 5 local test users (admin / supervisor / economist / employee / client)
python manage.py seed_initial_data --with-test-users

# Override the temporary password (env var or default WebWise2026!)
WEBWISE_SEED_PASSWORD='S0m3Th!ng' python manage.py seed_initial_data
```

The command is idempotent — re-running refreshes business fields in place and skips Zelo plan months that already have deliverables.

## Architecture

### Frontend routes
```
src/app/
├── api/                      # contact, indexnow, roast endpoints
├── local-seo/[industry]/     # /local-seo + per-industry pages
├── blog/                     # static blog posts
├── case-studies/             # portfolio
├── (dashboard)/dashboard/    # authenticated dashboard
│   ├── [business]/[project]/ # engagement detail
│   ├── review/               # supervisor approval queue
│   ├── plans/                # monthly plans
│   └── ...
└── [other service pages]
```

Most flat-URL service pages (`/local-seo`, `/technical-seo`) delegate rendering to `src/app/services/[slug]/[subslug]/page.tsx` while setting their own canonical URLs and metadata. Many WordPress-era 301 redirects live in `next.config.ts`.

### Backend apps
- `accounts` — User model with `role` (admin / employee / client)
- `employees` — `EmployeeProfile.category` (supervisor / economist / on_page / off_page / content / dev / etc.)
- `clients` — `ClientProfile` → `Business` → `Project` (engagement) → `ProjectService` → `MonthlyPlan` → `Deliverable`. Approval gate (submit / approve / reject) lives on `Deliverable`.
- `payments` — invoices, business expenses, exchange rates
- `reports` — GA4, GBP metrics
- `apps/keywords`, `apps/rankings`, `apps/discovery`, `apps/competitors` — DataForSEO integration

### Dashboard surfaces
- **Admin** — full access; pending-review banner
- **Supervisor** (employee + category=supervisor) — same scope as admin for the review queue
- **Economist** (employee + category=economist) — finances views
- **Employee** — assigned deliverables; "needs rework" panel for rejected items
- **Client** — own businesses, plans, payments, reports (filtered by approval gate)

### Key data files (`src/data/`)
- `site.ts` — site config (name, URL, phone, services, industries) — single source of truth
- `seo.ts` — per-page SEO metadata to prevent keyword cannibalization
- `serviceContent.ts` — rich service-page content (hero, FAQs, process steps)
- `blog.ts`, `faqs.ts`, `staticContent.ts`

### Styling
Tailwind v4 with custom CSS variables in `src/app/globals.css` under `@theme`. Brand: `primary` #25274d (navy), `accent` #ed7c21 (orange). Use semantic tokens (`text-primary`, `bg-secondary`) — not raw hex.

## Deployment

### Frontend (Hostinger VPS / Vercel)
1. Build: `npm run build`
2. Process manager: `pm2 start npm --name "webwise" -- start`
3. Reverse proxy via Nginx → port 3000
4. SSL via Let's Encrypt (`certbot --nginx`)
5. Submit sitemap (`/sitemap.xml`) to Google Search Console + Bing Webmaster
6. Trigger IndexNow on first deploy

### Backend
1. `python manage.py migrate`
2. `python manage.py collectstatic --noinput`
3. Gunicorn for HTTP; Daphne or Uvicorn for websockets
4. Celery worker + beat as separate systemd units
5. Nginx terminates TLS, proxies `/api/` and `/ws/` to the Django process
6. `python manage.py seed_initial_data` once on a fresh DB

### Update flow
```bash
git pull
cd backend && pip install -r requirements.txt && python manage.py migrate
cd .. && npm install && npm run build
pm2 restart webwise
sudo systemctl restart celery celery-beat
```

## Conventions

- Each page sets its own `generateMetadata()` from `src/data/seo.ts`
- Canonical URLs always per-page (never global) — supports URL restructuring
- JSON-LD schema added via `<Script type="application/ld+json">` in each page
- `skipTrailingSlashRedirect: true` in `next.config.ts` — avoid trailing slashes
- TypeScript strict mode enabled; `@/*` aliases to `./src/*`
- Every Deliverable on a client engagement passes through the supervisor approval gate before becoming `client_visible`
