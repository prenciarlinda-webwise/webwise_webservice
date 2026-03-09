# Web Wise Dashboard — Full Documentation

This document explains the complete backend and frontend architecture for the dashboard, user management, and all related features.

---

## Table of Contents

1. [Authentication & Users](#1-authentication--users)
2. [Clients & Projects](#2-clients--projects)
3. [Monthly Plans & Deliverables](#3-monthly-plans--deliverables)
4. [Employees & Task Logging](#4-employees--task-logging)
5. [Payments & Finances](#5-payments--finances)
6. [Reports & Analytics](#6-reports--analytics)
7. [Notifications](#7-notifications)
8. [Frontend Dashboard Pages](#8-frontend-dashboard-pages)
9. [API Reference](#9-api-reference)

---

## 1. Authentication & Users

### User Model (`backend/accounts/models.py`)

Custom user model extending Django's `AbstractUser` with role-based access.

| Field | Type | Notes |
|-------|------|-------|
| username | CharField | Unique login identifier |
| email | EmailField | |
| first_name, last_name | CharField | |
| phone | CharField(20) | Optional |
| role | CharField | Choices: `admin`, `employee`, `client` (default: `client`) |

**Helper properties:** `is_admin_user`, `is_employee`, `is_client`

### JWT Authentication

- **Access token:** 30 minutes
- **Refresh token:** 7 days (rotates on refresh)
- Login: `POST /api/auth/token/` → returns `{access, refresh}`
- Refresh: `POST /api/auth/token/refresh/` with `{refresh}` → new `{access, refresh}`

### Registration

`POST /api/auth/register/` accepts `username`, `email`, `password` (min 8 chars), `first_name`, `last_name`, `phone`, `role`. The `role` field defaults to `client` but can be set to `employee` when an admin creates employee accounts.

### Permissions (`backend/accounts/permissions.py`)

| Permission Class | Who Can Access |
|-----------------|----------------|
| IsAdmin | `role == 'admin'` only |
| IsEmployee | `role == 'employee'` only |
| IsClient | `role == 'client'` only |
| IsAdminOrEmployee | Admin or employee |

These are used across all views to control access.

### Frontend Auth (`src/context/AuthContext.tsx`)

React context that:
- Stores `accessToken`, `refreshToken`, and `user` object in state + localStorage
- Provides `login(username, password)`, `logout()`, `refreshAccessToken()`
- Auto-refreshes token on mount if refresh token exists
- Exposes `user.role` for role-based UI rendering

### API Client (`src/lib/api.ts`)

Axios instance at `http://localhost:8000/api/` with:
- Interceptor that adds `Authorization: Bearer <token>` header
- 401 response interceptor that attempts token refresh, then retries the request
- Falls back to logout if refresh fails

---

## 2. Clients & Projects

### ClientProfile (`backend/clients/models.py`)

Linked 1:1 to a User with `role='client'`.

| Field | Type | Notes |
|-------|------|-------|
| user | OneToOne → User | CASCADE delete |
| business_name | CharField(200) | |
| business_phone | CharField(20) | Optional |
| business_email | EmailField | Optional |
| services | JSONField | List of service strings |
| products | JSONField | List of product strings |
| price_per_service | JSONField | Dict: service → price |
| service_locations | JSONField | List of location strings |
| social_links | JSONField | Dict: platform → URL |
| notes | TextField | Optional |

### Project

Each client can have multiple projects (e.g., "Gimo's Roofing SEO").

| Field | Type | Notes |
|-------|------|-------|
| client | FK → ClientProfile | CASCADE |
| name | CharField(200) | |
| business_phone, business_email, business_address | Contact info | |
| website_url | URLField | |
| business_hours | TextField | |
| service_areas | JSONField | List |
| google_business_url, facebook_url, instagram_url | URLField | Social links |
| google_drive_url | URLField | Shared drive |
| industry | CharField(100) | e.g., "Roofing" |
| target_audience | JSONField | List |
| competitors | JSONField | List of `{name, notes}` |
| usps | JSONField | Unique selling points |
| marketing_channels | JSONField | List |
| nap_status | CharField(50) | NAP consistency status |
| status | CharField | `active`, `paused`, `completed`, `cancelled` |
| notes | TextField | |

### BusinessCatalogItem

Products/services a client's business offers.

| Field | Type | Notes |
|-------|------|-------|
| project | FK → Project | CASCADE |
| item_type | CharField | `product` or `service` |
| name | CharField(200) | |
| description | TextField | |
| price | Decimal(10,2) | Optional |
| price_unit | CharField(50) | e.g., "per sqft", "per rental" |
| duration_days | IntegerField | Optional |
| specifications | JSONField | Dict |
| sort_order | IntegerField | |

### Data Visibility by Role

- **Admin:** Sees everything — all clients, projects, financials
- **Employee:** Sees client list and project details, but NOT pricing, financial data, or personal contact info
- **Client:** Sees only their own profile and projects via `/api/clients/me/`

---

## 3. Monthly Plans & Deliverables

This is the core work tracking system. The hierarchy is:

```
Project → ProjectService → MonthlyPlan → Deliverable
```

### ProjectService

A service being provided to a project (e.g., "Local SEO Package").

| Field | Type | Notes |
|-------|------|-------|
| project | FK → Project | CASCADE |
| name | CharField(200) | |
| description | TextField | |
| monthly_price | Decimal(10,2) | Optional |
| status | CharField | `not_started`, `in_progress`, `completed` |

### MonthlyPlan

One plan per service per month.

| Field | Type | Notes |
|-------|------|-------|
| project_service | FK → ProjectService | CASCADE |
| month | DateField | Always first-of-month (e.g., `2026-01-01`) |
| status | CharField | `planned`, `in_progress`, `completed` |
| notes | TextField | |

**Important:** `unique_together = [project_service, month]` — only one plan per service per month.

When a MonthlyPlan is marked `completed`, the system auto-creates a Payment record.

### Deliverable

Individual tasks within a monthly plan.

| Field | Type | Notes |
|-------|------|-------|
| monthly_plan | FK → MonthlyPlan | CASCADE |
| category | CharField | 23 choices: `audit`, `gbp_post`, `blog_post`, `citation`, `backlink`, `on_page`, `technical`, `review`, `reporting`, etc. |
| title | CharField(300) | |
| description | TextField | |
| target_keyword | CharField(200) | Optional SEO keyword |
| status | CharField | `not_started`, `in_progress`, `completed`, `scheduled`, `published` |
| frequency | CharField | `once`, `weekly`, `bi_weekly`, `monthly`, `ongoing`, `daily`, `as_needed` |
| quantity | IntegerField | Default 1 |
| assigned_to | FK → User | Optional, SET_NULL |
| link | URLField | Draft/GDrive link |
| live_url | URLField | Published URL |
| start_date, due_date, completed_date | DateField | Optional |
| notes | TextField | |
| sort_order | IntegerField | |

**Ordering:** `['due_date', 'sort_order']` — deliverables sort chronologically by due date.

### Templates

Admins can create reusable `ServiceTemplate` → `TemplateDeliverable` templates and apply them to create a MonthlyPlan with pre-filled deliverables via `POST /api/clients/templates/apply/`.

### MonthlyMetrics

Quick KPI snapshot attached to a MonthlyPlan (1:1):

- GBP: views, searches, calls, direction requests, website clicks
- GA4: organic sessions, conversions
- Rankings: keywords in top 3, top 10, local pack
- Reviews: total, average rating
- Authority: new backlinks, domain authority
- Financials: retainer, content writer cost, tool costs, link building spend, other costs
- Computed: `total_costs`, `profit_margin`

---

## 4. Employees & Task Logging

### EmployeeProfile (`backend/employees/models.py`)

Linked 1:1 to a User with `role='employee'`.

| Field | Type | Notes |
|-------|------|-------|
| user | OneToOne → User | CASCADE |
| hourly_rate | Decimal(8,2) | In Albanian Lek (LEK) |

**Important:** Deleting an employee profile also deletes the associated User account (cascade in `perform_destroy`). This prevents orphan users that block re-registration with the same username.

### TaskLog

Time tracking for employee work.

| Field | Type | Notes |
|-------|------|-------|
| employee | FK → EmployeeProfile | CASCADE |
| client | FK → ClientProfile | Optional |
| deliverable | FK → Deliverable | Optional, SET_NULL |
| description | CharField(500) | |
| hours | Decimal(5,2) | |
| date | DateField | |
| document_link | URLField | Draft/GDrive link |
| live_link | URLField | Published URL |

**Computed:** `cost = hours × employee.hourly_rate`

**Validation:** If no deliverable is linked, the log must have a description and at least one link.

### Employee Dashboard View

Employees see:
- Their assigned deliverables across all projects
- Task logging interface to record hours
- Notification system to alert admin (e.g., low client photos)

---

## 5. Payments & Finances

### Payment (`backend/payments/models.py`)

| Field | Type | Notes |
|-------|------|-------|
| project_service | FK → ProjectService | CASCADE |
| monthly_plan | FK → MonthlyPlan | Optional |
| amount | Decimal(10,2) | |
| payment_type | CharField | `predetermined` or `custom` |
| status | CharField | `upcoming`, `pending`, `paid`, `overdue`, `cancelled` |
| description | CharField(300) | |
| due_date, paid_date | DateField | |

**Auto-creation:** When a MonthlyPlan status is set to `completed`, a Payment is automatically created with the service's monthly_price.

### ProjectCost

Ad-hoc costs for a project (e.g., content writer fees, tool subscriptions).

| Field | Type |
|-------|------|
| project | FK → Project |
| description | CharField(300) |
| amount | Decimal(10,2) |
| date | DateField |

### BusinessExpense

Recurring business-level expenses (e.g., Anthropic API $100/mo, Ahrefs $29/mo).

| Field | Type | Notes |
|-------|------|-------|
| name | CharField(200) | |
| amount | Decimal(10,2) | |
| frequency | CharField | `monthly`, `yearly`, `one_time` |
| category | CharField(100) | e.g., "Tools", "AI" |
| start_date, end_date | DateField | |
| is_active | BooleanField | |

**Computed:** `monthly_cost` → normalizes to monthly amount.

### ExchangeRate

Stores currency conversion rates (e.g., USD → LEK).

### Dashboard Summary (`GET /api/payments/summary/`)

Admin-only endpoint that computes:
- Total revenue, paid, pending, upcoming, overdue
- Total costs, net profit
- This month's revenue/costs/profit
- Next month's planned revenue
- Monthly tool costs (from active business expenses)

---

## 6. Reports & Analytics

### Report (PDF uploads)

| Field | Type | Notes |
|-------|------|-------|
| client | FK → ClientProfile | |
| project | FK → Project | Optional |
| monthly_plan | FK → MonthlyPlan | Optional — links report to specific month |
| title | CharField(200) | |
| pdf | FileField | Uploaded to `reports/YYYY/MM/` |
| uploaded_by | FK → User | Auto-set |

### GBPMetrics (Google Business Profile)

Monthly snapshot per project. Key fields:

- **Interactions:** calls, chat_clicks, bookings, direction_clicks, website_clicks, total_interactions, interactions_change_pct
- **Discovery:** profile_views, profile_views_change_pct
- **Platform breakdown:** search_desktop_pct, search_mobile_pct, maps_desktop_pct, maps_mobile_pct
- **Reviews:** photo_count, review_count, review_avg_rating, new_reviews
- **Posts:** posts_published
- **Unique together:** `[project, month]`

### GA4Metrics (Google Analytics 4)

Monthly snapshot per project. Key fields:

- **Users:** active_users, new_users, total_sessions, avg_engagement_time_sec
- **Events:** total_events, page_views, scrolls, phone_clicks, estimate_requests, whatsapp_clicks, email_clicks, direction_clicks, high_intent_pages, financing_interest
- **JSON fields:** traffic_sources (list), country_breakdown (list), top_pages (list), page_speed (dict)
- **Unique together:** `[project, month]`

### SearchTermSnapshot (Keyword Rankings)

Individual keyword tracking per project per month.

| Field | Type | Notes |
|-------|------|-------|
| project | FK → Project | |
| month | DateField | |
| source | CharField | `gbp`, `gsc`, `brightlocal`, `ahrefs` |
| keyword | CharField(300) | |
| impressions | IntegerField | |
| clicks | IntegerField | |
| avg_position | Decimal(6,1) | |
| local_pack | BooleanField | Whether keyword ranks in local pack |

### How Metrics Display in Project View

The project detail page (`/dashboard/projects/[id]`) fetches GBP, GA4, and keyword data and matches them to MonthlyPlans by month date string. Inside each expanded monthly plan, a "Performance Metrics" section shows mini-tabs (GBP / GA4 / Keywords) with inline metric displays. This lets you match deliverable effort with measured results.

---

## 7. Notifications

### Notification Model (`backend/notifications/models.py`)

| Field | Type | Notes |
|-------|------|-------|
| sender | FK → User | Auto-set to request.user |
| recipient | FK → User | |
| project | FK → Project | Optional |
| category | CharField | `photo_low`, `review_request`, `deadline`, `client_action`, `general` |
| priority | CharField | `low`, `medium`, `high`, `urgent` |
| title | CharField(300) | |
| message | TextField | |
| is_read | BooleanField | Default false |

### How It Works

- **Employees** (e.g., Rea) can send alerts to admin when running low on client photos or need action
- **Admin** sees received notifications with unread count badge in the dashboard header
- Quick alert buttons on the notifications page pre-populate common alert types (low photos, need review, deadline approaching)
- Unread count polls every 30 seconds via `GET /api/notifications/unread-count/`
- Mark individual: `POST /api/notifications/<id>/read/`
- Mark all: `POST /api/notifications/mark-all-read/`

---

## 8. Frontend Dashboard Pages

### Layout (`src/app/(dashboard)/layout.tsx`)

- Sidebar (left 256px) + main content area
- Notification bell with unread count badge in header
- Shows user name and role
- Redirects to `/login` if not authenticated

### Sidebar Navigation (`src/components/dashboard/DashboardSidebar.tsx`)

Role-based navigation items:

| Item | Route | Roles |
|------|-------|-------|
| Dashboard | `/dashboard` | All |
| Clients | `/dashboard/clients` | Admin, Employee |
| Projects | `/dashboard/projects` | Admin, Employee |
| Payments | `/dashboard/payments` | Admin |
| Employees | `/dashboard/employees` | Admin |
| Reports | `/dashboard/reports` | Admin |
| Notifications | `/dashboard/notifications` | Admin, Employee |
| My Deliverables | `/dashboard/tasks` | Employee |
| My Profile | `/dashboard/profile` | Client |
| My Projects | `/dashboard/my-projects` | Client |
| Progress | `/dashboard/progress` | Client |
| My Payments | `/dashboard/my-payments` | Client |
| My Reports | `/dashboard/my-reports` | Client |

### Dashboard Home (`/dashboard`)

Three role-specific components:
- **AdminDashboard:** Stats cards (total clients, revenue, pending payments, active projects), recent payments, upcoming deliverables
- **EmployeeDashboard:** Assigned tasks, hours logged this month, task completion stats
- **ClientDashboard:** Project status, upcoming deliverables, payment history

### Clients Page (`/dashboard/clients`)

- List all clients with business name, email, phone
- Click to view/edit client detail
- Create new client (creates User + ClientProfile in one flow)

### Client Detail (`/dashboard/clients/[id]`)

- Edit business info, services, products, pricing, locations, social links
- View all projects for this client
- Navigate to individual projects

### Projects Page (`/dashboard/projects`)

- List all projects with client name, status, industry
- Filter by client
- Create new project linked to a client

### Project Detail (`/dashboard/projects/[id]`)

The most complex page. Shows:

1. **Project info header** — name, client, status, website, contact info
2. **Business Catalog tab** — products/services the client offers
3. **Services & Plans** — expandable service sections, each containing:
   - Monthly plans (sorted newest first)
   - Each plan expands to show:
     - **Deliverables table** — sortable by due date, with status, assignee, category, links
     - **Reports section** — PDF uploads linked to this month
     - **Performance Metrics** — GBP, GA4, Keywords tabs showing data for this month
   - Add/edit deliverables inline
   - Add/edit monthly plans

### Employees Page (`/dashboard/employees`)

- List employees with name, email, hourly rate (in LEK)
- Create new employee (registers User + creates EmployeeProfile)
- Delete employee (cascades to delete User account)
- View/edit hourly rates

### Tasks Page (`/dashboard/tasks`) — Employee View

- Shows deliverables assigned to the logged-in employee
- Filter by status, project
- Log time against deliverables
- Update deliverable status and add links

### Payments Page (`/dashboard/payments`)

- Dashboard summary stats at top
- Payment list with filters (status, project, client)
- Create custom payments
- Mark payments as paid
- Project costs management
- Business expenses management

### Reports Page (`/dashboard/reports`)

4 tabs:
1. **GBP Metrics** — CRUD for Google Business Profile monthly data
2. **GA4 Analytics** — CRUD for Google Analytics 4 monthly data
3. **Search Terms** — CRUD for keyword ranking snapshots
4. **PDF Reports** — Upload/manage PDF report files

All metric forms use `type="month"` date picker, which auto-normalizes to first-of-month (YYYY-MM-01) for consistent matching with MonthlyPlans.

### Notifications Page (`/dashboard/notifications`)

- **Admin view:** List received notifications, mark as read, mark all read
- **Employee view:** List sent notifications + quick alert buttons:
  - "Low on Photos" (photo_low category)
  - "Need Review" (review_request)
  - "Deadline Approaching" (deadline)
  - "Client Action Needed" (client_action)
- Send alert modal with project selector, priority, title, message

### Profile Page (`/dashboard/profile`) — Client View

- View/edit own business profile
- Change password

---

## 9. API Reference

### Base URL: `http://localhost:8000/api/`

All endpoints require `Authorization: Bearer <token>` except login and register.

```
# Auth
POST   /auth/token/                    Login (get JWT)
POST   /auth/token/refresh/            Refresh JWT
POST   /auth/register/                 Register new user
GET    /auth/me/                       Get current user
PATCH  /auth/me/                       Update current user
POST   /auth/me/password/              Change password
GET    /auth/users/                    List users (admin)
GET    /auth/users/<id>/               User detail (admin)

# Clients
GET|POST   /clients/                   List/create clients
GET|PATCH|DELETE /clients/<id>/         Client detail
GET|PATCH  /clients/me/                Client's own profile

# Projects
GET|POST   /clients/projects/          List/create projects
GET|PATCH|DELETE /clients/projects/<id>/

# Services
GET|POST   /clients/services/          List/create services
GET|PATCH|DELETE /clients/services/<id>/

# Monthly Plans
GET|POST   /clients/plans/             ?project=&service=&client=&month=
GET|PATCH|DELETE /clients/plans/<id>/

# Deliverables
GET|POST   /clients/deliverables/      ?plan=&status=&assigned_to=
GET|PATCH|DELETE /clients/deliverables/<id>/

# Templates
GET|POST   /clients/templates/
GET|PATCH|DELETE /clients/templates/<id>/
POST       /clients/templates/apply/    Apply template to create plan
GET|POST   /clients/template-items/
GET|PATCH|DELETE /clients/template-items/<id>/

# Metrics (per MonthlyPlan)
POST       /clients/metrics/            Upsert metrics for a plan
GET|PATCH  /clients/metrics/<id>/

# Business Catalog
GET|POST   /clients/catalog/            ?project=
GET|PATCH|DELETE /clients/catalog/<id>/

# Employees
GET|POST   /employees/                  List/create employees
GET|PATCH|DELETE /employees/<id>/        Detail (delete cascades to User)
GET|POST   /employees/tasks/            ?employee=&client=
GET|PATCH|DELETE /employees/tasks/<id>/

# Payments
GET|POST   /payments/                   ?status=&project=&client=
GET|PATCH|DELETE /payments/<id>/
GET|POST   /payments/costs/             ?project=
GET|PATCH|DELETE /payments/costs/<id>/
GET        /payments/summary/           Admin dashboard stats
GET|POST   /payments/expenses/
GET|PATCH|DELETE /payments/expenses/<id>/
GET|POST   /payments/exchange-rates/

# Reports
GET|POST   /reports/                    ?client=&project=&monthly_plan=
GET|PATCH|DELETE /reports/<id>/
GET|POST   /reports/gbp/                ?project=
GET|PATCH|DELETE /reports/gbp/<id>/
GET|POST   /reports/ga4/                ?project=
GET|PATCH|DELETE /reports/ga4/<id>/
GET|POST   /reports/search-terms/       ?project=&month=&source=
GET|PATCH|DELETE /reports/search-terms/<id>/

# Notifications
GET|POST   /notifications/
GET|PATCH|DELETE /notifications/<id>/
POST       /notifications/<id>/read/
POST       /notifications/mark-all-read/
GET        /notifications/unread-count/
```

---

## Key Architecture Decisions

1. **Month normalization:** All month-based data uses `YYYY-MM-01` format. This is critical for matching MonthlyPlans with GBP/GA4/keyword metrics.

2. **Role-based serializer filtering:** Serializers dynamically remove sensitive fields (pricing, financials, contact info) based on `request.user.role`. This happens in `to_representation()` overrides.

3. **Employee delete cascade:** `EmployeeDetailView.perform_destroy()` deletes both the EmployeeProfile and the User, preventing orphan accounts.

4. **Auto-payment on plan completion:** When a MonthlyPlan's status changes to `completed`, a Payment record is auto-created from the service's `monthly_price`.

5. **Deliverable ordering:** Sorted by `due_date` then `sort_order`, so tasks from different assignees interleave chronologically.

6. **Currency:** Employee rates and hourly costs are in Albanian Lek (L). Project payments and service prices are in EUR.
