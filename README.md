# Stylework Lead Tracker

A full-stack Lead Tracker built for the **Stylework Junior Full Stack Engineer Assignment**. The application supports creating leads, listing and searching leads, filtering by status, server-side pagination, updating an individual lead's status, and bulk-updating multiple selected leads.

**Repository:** https://github.com/rahul-kapgate/stylework-lead-tracker

> **Live Frontend URL:** https://stylework-lead-tracker.rahulkapgate.in/  
> **Live API URL:** https://stylework-lead-tracker.rahulkapgate.in/

---

## Features

### Required assignment features

- Create Lead
- Update Lead Status
- Search Leads
- List Leads
- Lead fields: Name, Email, Phone, Status, Created At

### Additional functionality

- Server-side pagination
- Search by name, email, or phone
- Status filtering
- Debounced search
- Individual status update directly from the table
- Multi-row selection
- Bulk status update
- Bulk lead creation API
- Lead journey/status history
- Date and time display
- Responsive UI
- Loading, empty, and error states
- Input validation and API error handling
- Frontend and backend automated tests

---

## Lead Status Flow

Supported statuses:

```text
NEW
CONTACTED
QUALIFIED
CONVERTED
LOST
```

Every lead starts with `NEW`. Status changes append an entry to `lead_journey` containing a note, status, and timestamp.

```json
[
  {
    "note": "Lead created",
    "status": "NEW",
    "timestamp": "2026-09-23T08:40:00.000Z"
  },
  {
    "note": "Lead status changed to CONTACTED",
    "status": "CONTACTED",
    "timestamp": "2026-09-23T09:15:00.000Z"
  }
]
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React | UI |
| TypeScript | Type safety |
| Vite | Build/dev tooling |
| Tailwind CSS | Styling |
| shadcn/ui | UI primitives |
| MUI X DataGrid | Lead table, pagination, selection |
| TanStack Query | Server-state fetching/caching/mutations |
| Axios | API communication |
| Motion | UI transitions |
| Sonner | Toast notifications |
| Vitest | Test runner |
| React Testing Library | Component/behavior tests |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | Runtime |
| Express | REST API |
| TypeScript | Type safety |
| PostgreSQL | Database |
| `pg` | PostgreSQL access |
| Jest | Backend tests |
| Supertest | API integration tests |

---

## Architecture

```text
┌──────────────────────────────────┐
│          React Frontend          │
│                                  │
│ Pages / Components / Hooks       │
│ TanStack Query + Axios           │
└────────────────┬─────────────────┘
                 │ HTTP / JSON
                 ▼
┌──────────────────────────────────┐
│        Express Backend API       │
│                                  │
│ Route → Validation → Controller  │
│       → Service → Repository     │
└────────────────┬─────────────────┘
                 │ SQL
                 ▼
┌──────────────────────────────────┐
│           PostgreSQL             │
│                                  │
│ leads + lead_journey             │
└──────────────────────────────────┘
```

The backend is layered so routing/HTTP concerns, validation, business logic, and SQL access stay separate. The frontend similarly separates feature UI, API functions, hooks, types, and validation.

---

## Project Structure

```text
stylework-lead-tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   └── leads/
│   │   │       ├── lead.controller.ts
│   │   │       ├── lead.repository.ts
│   │   │       ├── lead.routes.ts
│   │   │       ├── lead.service.ts
│   │   │       └── ...
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   │   └── leads.test.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── features/
│   │   │   └── leads/
│   │   │       ├── api/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── types/
│   │   │       └── validation/
│   │   ├── pages/
│   │   │   └── LeadsPage.tsx
│   │   └── test/
│   │       └── setup.ts
│   └── package.json
│
├── README.md
└── AGENT.md
```

---

## API Overview

The frontend may call `/leads` when the Axios client already includes `/api` in its base URL. Complete backend routes are shown below.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/leads` | Create one lead |
| `POST` | `/api/leads/bulk` | Create multiple leads |
| `GET` | `/api/leads` | List/search/filter/paginate leads |
| `PATCH` | `/api/leads/:id/status` | Update one lead status |
| `PATCH` | `/api/leads/bulk/status` | Update multiple lead statuses |

### List leads

```http
GET /api/leads?page=1&limit=10
```

Search:

```http
GET /api/leads?page=1&limit=10&search=rahul
```

Filter:

```http
GET /api/leads?page=1&limit=10&status=QUALIFIED
```

Combined:

```http
GET /api/leads?page=1&limit=10&search=rahul&status=QUALIFIED
```

### Create a lead

```http
POST /api/leads
Content-Type: application/json
```

```json
{
  "name": "Rahul Kapgate",
  "email": "rahul@example.com",
  "phone": "+919876543210"
}
```

### Update one lead

```http
PATCH /api/leads/:id/status
Content-Type: application/json
```

```json
{
  "status": "CONTACTED"
}
```

### Bulk status update

```http
PATCH /api/leads/bulk/status
Content-Type: application/json
```

```json
{
  "leadIds": [
    "lead-id-1",
    "lead-id-2"
  ],
  "status": "QUALIFIED"
}
```

---

## Database Model

The primary entity is `leads` with the following conceptual fields:

```text
id
name
email
phone
status
created_at
updated_at
lead_journey
```

`lead_journey` stores status-history entries as JSON for the assignment scope. For a larger production CRM, this history would normally be moved to a normalized relational history/audit table.

---

# Local Setup

## Prerequisites

- Node.js
- npm
- Git
- PostgreSQL or a hosted PostgreSQL database

## 1. Clone

```bash
git clone https://github.com/rahul-kapgate/stylework-lead-tracker.git
cd stylework-lead-tracker
```

## 2. Backend

```bash
cd backend
npm install
```

Create the backend environment file used by the project. Typical values are:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
PORT=5000
NODE_ENV=development
```

If `.env.example` exists, use it as the source of truth for variable names.

macOS/Linux:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the PostgreSQL schema/database, then start the API:

```bash
npm run dev
```

The API will normally be available on a local port such as `http://localhost:5000`. Use the port configured by the backend if it differs.

## 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Set the backend URL using the environment variable expected by `src/api/client.ts`.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

> If the existing client uses a different environment variable name, keep the name already defined in the project.

Start the frontend:

```bash
npm run dev
```

Vite normally starts at `http://localhost:5173`.

---

# Testing

## Backend

Backend tests use Jest and Supertest. They cover the important API paths, including:

- lead creation
- bulk creation
- invalid payloads
- list/pagination
- search
- status filtering
- individual status updates
- lead journey updates
- invalid/missing lead cases
- bulk status updates
- rollback/error behavior

Run:

```bash
cd backend
npm test
```

Coverage:

```bash
npm run test:coverage
```

## Frontend

Frontend tests use Vitest and React Testing Library. They cover:

- search normalization and validation
- debounce behavior
- search component behavior
- status selector behavior
- status mutation hooks
- table mapping and pagination behavior
- single lead status changes
- page-level interactions

Run once:

```bash
cd frontend
npm run test:run
```

Watch mode:

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

If the coverage provider is not installed:

```bash
npm install -D @vitest/coverage-v8
```

---

# Key Engineering Decisions

## Server-side pagination

Pagination is handled by the backend instead of downloading all leads to the browser. This keeps the list usable as the dataset grows and keeps search/filter/pagination logic consistent.

## Debounced search

Search is debounced before updating the API query, reducing unnecessary requests while keeping typing responsive.

## TanStack Query for server state

Lead data is treated as server state. After mutations, lead queries are invalidated/refetched so the UI remains consistent with the database.

## Direct status editing

The status badge/dropdown is editable directly inside the table, making the assignment's Update Lead Status requirement obvious and fast to use.

## Bulk status updates

Checkbox selection allows multiple leads to be changed in one action and one backend request instead of one request per row.

## Lead journey

Every status change appends an audit-style history entry. JSON keeps the assignment implementation compact; a normalized history table would be preferable at larger scale.

## Layered backend

Routes, controllers, services, repositories, validation, and database access are separated to make the backend easier to test and maintain.

---

# Trade-offs

### Lightweight/raw PostgreSQL access

This keeps SQL explicit and avoids unnecessary abstraction for a small assignment.

**Trade-off:** an ORM and formal migration system could reduce repetitive database mapping in a larger application.

### JSON lead journey

Simple and fast for assignment scope.

**Trade-off:** analytics and large-scale querying across status history would be easier with a separate relational table.

### Query invalidation after updates

Reliable and simple.

**Trade-off:** optimistic updates could make the UI feel faster but add rollback complexity.

### No authentication/authorization

Authentication was not part of the required assignment scope.

**Trade-off:** a production CRM should authenticate users and authorize write operations.

### Focused lead model

The project intentionally stays close to the requested fields.

**Trade-off:** a real CRM would likely add lead owner, source, company, tags, notes, next follow-up, and permissions.

---

# Deployment

The frontend and backend can be deployed independently.

```text
React/Vite Frontend
       │
       ▼
Vercel / Netlify
       │ HTTPS
       ▼
Node/Express API
       │
       ▼
Render / Railway / VPS / EC2
       │
       ▼
Hosted PostgreSQL
```

## Frontend

```bash
cd frontend
npm run build
```

Configure the production API URL and deploy the Vite application.

## Backend

1. Configure production environment variables.
2. Install dependencies.
3. Build TypeScript if required by the backend scripts.
4. Start the production server.
5. Configure CORS for the deployed frontend origin.
6. Point the API to the production PostgreSQL database.

Before submitting, update the live frontend/API links at the top of this README.

---

# Error Handling

The application handles:

- invalid request payloads
- invalid status values
- invalid search input
- missing leads
- API failures
- loading states
- empty results
- mutation failures

The UI shows useful feedback and supports retry/refetch behavior where appropriate.

---

# Future Improvements

1. Authentication and role-based authorization
2. Lead details page
3. Separate relational lead-history table
4. Advanced filters and sorting
5. Lead source/owner fields
6. Notes and follow-up reminders
7. Optimistic status updates
8. End-to-end tests with Playwright
9. Database migrations and seed scripts
10. Docker/Docker Compose setup
11. OpenAPI/Swagger documentation
12. Structured logging and request tracing
13. Rate limiting and additional API security
14. CI workflow for linting/tests
15. Better analytics and conversion metrics

---

# Assignment Coverage

| Requirement | Status |
| --- | --- |
| Create Lead | Implemented |
| Update Lead Status | Implemented |
| Search Leads | Implemented |
| List Leads | Implemented |
| Name | Implemented |
| Email | Implemented |
| Phone | Implemented |
| Status | Implemented |
| Created At | Implemented |
| React + TypeScript | Implemented |
| PostgreSQL | Implemented |
| README.md | Included |
| AGENT.md | Included |
| Automated Testing | Included |

Additional functionality includes bulk creation, bulk status updates, filtering, server pagination, status history, and debounced search.

---

## Author

**Rahul Kapgate**  
GitHub: https://github.com/rahul-kapgate
