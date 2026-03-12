# Dashboard Architecture Map

Quick reference for frontend → backend mapping. Single source of truth for the client module.

---

## Data Hierarchy

```
ClientProfile (pk)
└── Project (pk) — e.g. "904 Dumpster"
    └── ProjectService (pk) — e.g. "Starter Local SEO"
        └── MonthlyPlan (pk) — e.g. January 2026
            ├── Deliverables — tasks/work items
            ├── Financials — retainer, costs (on MonthlyPlan itself)
            └── Reports (PDF) — uploaded monthly reports

Analytics (per Project per Month — stored in reports app):
├── GBPMetrics — Google Business Profile monthly snapshot
├── GA4Metrics — Google Analytics 4 monthly snapshot
└── SearchTermSnapshot — keyword rankings per source
```

---

## Frontend → Backend API Map

### Admin Pages

| Frontend Page | Route | Backend API | Purpose |
|---|---|---|---|
| Dashboard | `/dashboard` | `GET /payments/summary/`, `GET /payments/expenses/`, `GET /clients/plans/?month=X`, `GET /payments/?status=pending\|overdue`, `GET /payments/personal/summary/?month=X` | Financial overview, monthly progress, personal finance |
| Clients List | `/dashboard/clients` | `GET /clients/` | List all clients (row = clickable link) |
| Client Detail | `/dashboard/clients/[id]` | `GET /clients/{id}/`, `GET /payments/?client={id}` | Contact info, projects, payments summary |
| Projects List | `/dashboard/projects` | `GET /clients/` (reads nested projects) | List all projects (row = clickable link) |
| **Project Detail** | `/dashboard/projects/[id]` | `GET /clients/projects/{id}/`, `GET /reports/gbp/?project={id}`, `GET /reports/ga4/?project={id}`, `GET /reports/search-terms/?project={id}`, `GET /payments/?project={id}` | **Main workspace** — deliverables, metrics (GBP/GA4/keywords), reports, catalog |
| Monthly Plans | `/dashboard/plans` | `GET /clients/plans/` | Deliverables by month across all clients |
| PDF Reports | `/dashboard/reports` | `GET /reports/`, `POST /reports/` | Upload/download PDF reports only |
| Payments | `/dashboard/payments` | `GET /payments/summary/`, `GET /payments/`, `GET /payments/expenses/`, `GET /payments/exchange-rates/`, `GET /payments/personal/income/`, `GET /payments/personal/expenses/`, `GET /payments/personal/summary/` | All financial management (business + personal) |
| Employees | `/dashboard/employees` | `GET /employees/`, `GET /employees/tasks/`, `GET /clients/` | Employee profiles + time logs |
| Notifications | `/dashboard/notifications` | `GET /notifications/`, `POST /notifications/` | In-app messaging |

### Employee Pages

| Frontend Page | Route | Backend API | Purpose |
|---|---|---|---|
| Dashboard | `/dashboard` | `GET /clients/plans/` | Assigned tasks overview |
| Tasks | `/dashboard/tasks` | `GET /clients/plans/`, `GET /employees/tasks/`, `PATCH /clients/deliverables/{id}/`, `POST /employees/tasks/` | Manage assigned work + log time |
| Notifications | `/dashboard/notifications` | `GET /notifications/`, `POST /notifications/` | Send alerts to admin |

### Client Pages

| Frontend Page | Route | Backend API | Purpose |
|---|---|---|---|
| Dashboard | `/dashboard` | `GET /clients/projects/`, `GET /payments/` | Project overview |
| My Projects | `/dashboard/my-projects` | `GET /clients/projects/` | View own projects |
| Progress | `/dashboard/progress` | `GET /clients/plans/` | View deliverable status |
| My Payments | `/dashboard/my-payments` | `GET /payments/` | Payment schedule |
| My Reports | `/dashboard/my-reports` | `GET /reports/` | Download PDF reports |
| Profile | `/dashboard/profile` | `GET /clients/me/`, `PATCH /clients/me/` | Edit business profile |

---

## Where Metrics Live (Single Source of Truth)

**Analytics are ONLY entered/edited from the Project Detail page** (`/dashboard/projects/[id]`).

| Metric Type | Backend Model | Backend API | Keyed By |
|---|---|---|---|
| GBP (calls, clicks, views, reviews) | `reports.GBPMetrics` | `GET/POST/PUT/DELETE /reports/gbp/` | `project + month` (unique_together) |
| GA4 (sessions, users, events, traffic) | `reports.GA4Metrics` | `GET/POST/PUT/DELETE /reports/ga4/` | `project + month` (unique_together) |
| Keywords (rankings, impressions) | `reports.SearchTermSnapshot` | `GET/POST/PUT/DELETE /reports/search-terms/` | `project + month + source + keyword` |
| Financials (retainer, costs) | `clients.MonthlyPlan` fields | `PATCH /clients/plans/{id}/` | Part of the monthly plan |

**There is NO standalone metrics page.** The old `clients.MonthlyMetrics` model has been removed.

---

## CRUD Operations

### Deliverables
```
List:    GET  /clients/deliverables/?plan=X&status=X&assigned_to=X
Create:  POST /clients/deliverables/  {monthly_plan, category, title, ...}
Update:  PATCH /clients/deliverables/{id}/  {status, assigned_to, link, live_url, ...}
Delete:  DELETE /clients/deliverables/{id}/
```

### GBP Metrics (per project per month)
```
List:    GET  /reports/gbp/?project=X
Create:  POST /reports/gbp/  {project, month, calls, website_clicks, ...}
Update:  PUT  /reports/gbp/{id}/  {calls, website_clicks, ...}
Delete:  DELETE /reports/gbp/{id}/
```

### GA4 Metrics (per project per month)
```
List:    GET  /reports/ga4/?project=X
Create:  POST /reports/ga4/  {project, month, active_users, total_sessions, ...}
Update:  PUT  /reports/ga4/{id}/  {active_users, total_sessions, ...}
Delete:  DELETE /reports/ga4/{id}/
```

### Search Terms (per project per month per keyword)
```
List:    GET  /reports/search-terms/?project=X&month=X&source=X
Create:  POST /reports/search-terms/  {project, month, source, keyword, impressions, ...}
Update:  PUT  /reports/search-terms/{id}/
Delete:  DELETE /reports/search-terms/{id}/
```

### Personal Income (per month, admin only)
```
List:    GET  /payments/personal/income/?month=X
Create:  POST /payments/personal/income/  {source, description, amount, currency, month, is_recurring}
Update:  PATCH /payments/personal/income/{id}/
Delete:  DELETE /payments/personal/income/{id}/
Summary: GET  /payments/personal/summary/?month=X  (income/expenses/savings breakdown)
```

### Personal Expenses (per month, admin only)
```
List:    GET  /payments/personal/expenses/?month=X&category=X
Create:  POST /payments/personal/expenses/  {category, description, amount, currency, month, is_recurring}
Update:  PATCH /payments/personal/expenses/{id}/
Delete:  DELETE /payments/personal/expenses/{id}/
```

---

## Role Permissions

| Resource | Admin | Employee | Client |
|---|---|---|---|
| Client profiles | Full CRUD | Read (no contact/pricing) | Own profile only |
| Projects | Full CRUD | Read all | Own projects only |
| Deliverables | Full CRUD | Read/update own assigned | Read own |
| Monthly plans | Full CRUD | Read all | Read own |
| GBP/GA4/Keywords | Full CRUD | No access | No access |
| Payments | Full CRUD | No access | Read own (no amounts) |
| Employees | Full CRUD | — | No access |
| Reports (PDF) | Full CRUD | Read | Read own |
| Financials on plan | Read/write | Hidden | Hidden |
| Personal income/expenses | Full CRUD | No access | No access |

---

## Key File Paths

### Backend
- Models: `backend/clients/models.py`, `backend/reports/models.py`, `backend/payments/models.py`, `backend/employees/models.py`
- Serializers: `backend/clients/serializers.py`, `backend/reports/serializers.py`, `backend/payments/serializers.py`
- Views: `backend/clients/views.py`, `backend/reports/views.py`, `backend/payments/views.py`
- URLs: `backend/clients/urls.py`, `backend/reports/urls.py`, `backend/payments/urls.py`

### Frontend
- Project Detail (main workspace): `src/app/(dashboard)/dashboard/projects/[id]/page.tsx`
- Plans (deliverables view): `src/app/(dashboard)/dashboard/plans/page.tsx`
- Client Detail: `src/app/(dashboard)/dashboard/clients/[id]/page.tsx`
- PDF Reports: `src/app/(dashboard)/dashboard/reports/page.tsx`
- Sidebar nav: `src/components/dashboard/DashboardSidebar.tsx`
- Auth context: `src/context/AuthContext.tsx`
- API client: `src/lib/api.ts`
