# AGENT.md

## Purpose

This document records how AI tools were used while building the **Stylework Lead Tracker**.

The assignment explicitly permits and encourages the use of AI development tools. This file is intended to make that usage transparent and to distinguish AI-assisted work from the developer's final engineering decisions.

---

## AI Tool Used

### ChatGPT by OpenAI

ChatGPT was used as a development assistant during implementation, debugging, testing, UI refinement, and documentation.

AI output was treated as a suggestion rather than automatically trusted code. Suggestions were reviewed, adapted to the existing project structure, run locally, and corrected when they did not match the installed libraries or actual application behavior.

No production credentials, private database passwords, or other secrets were intentionally provided to the AI.

---

# How AI Was Used

## 1. Understanding and planning the assignment

AI helped break the assignment into a small full-stack architecture covering:

- lead creation
- lead listing
- search
- pagination
- status updates
- frontend/backend separation
- validation
- testing
- documentation

The final scope and implementation decisions remained with the developer.

---

## 2. Backend architecture and debugging

AI was used to discuss and review a layered backend structure:

```text
route
  ↓
validation
  ↓
controller
  ↓
service
  ↓
repository
  ↓
PostgreSQL
```

It was also used to reason about:

- PostgreSQL queries
- status updates
- bulk status changes
- transaction behavior
- error handling
- lead journey/history
- Jest/Supertest test failures

The developer ran the API locally, inspected the actual PostgreSQL/Jest output, and finalized fixes based on observed behavior.

---

## 3. Frontend architecture and UI refinement

AI assisted with suggestions for:

- feature-based React folder organization
- TanStack Query hooks
- Axios API functions
- debounced search
- input validation
- MUI DataGrid configuration
- checkbox/row-selection styling
- individual status updates
- bulk status updates
- loading and empty states
- dropdown styling
- date/time formatting
- responsive table and toolbar behavior

The final UI was integrated and reviewed in the browser by the developer.

---

## 4. Testing

AI helped plan and draft tests for both sides of the application.

### Backend test areas

- create lead
- invalid payloads
- bulk lead creation
- list and pagination
- search by name/email
- status filtering
- individual status update
- lead journey update
- invalid status
- missing lead
- bulk status update
- bulk validation
- transaction rollback

### Frontend test areas

- search validation
- search normalization
- debounce hook
- search component
- status selector
- status mutation hooks
- DataGrid wrapper behavior
- pagination mapping
- page-level lead interactions

AI also helped interpret test output and adjust assertions when runtime behavior differed from an initial assumption, such as locale-specific date formatting.

The developer executed the tests locally and treated real test output as the source of truth.

---

# Representative Prompts

The following examples are shortened versions of the types of prompts used during development.

### Assignment understanding

> Explain this lead-tracker assignment and suggest a clean full-stack architecture for React, TypeScript, Node/Express, and PostgreSQL.

### Search implementation

> Add a debounced lead search by name, email, or phone and keep search validation separate from the page component.

### DataGrid UI

> The checkbox in the MUI DataGrid selection column is clipped. Find the styling problem and fix the checkbox column without manually adding another checkbox column.

### Date display

> Show both date and time in the Created column and keep the column readable.

### Single status update

> Add an update-status dropdown directly in the lead table and connect it to the existing PATCH status API.

### Bulk status update

> When multiple rows are selected, show an action to update all selected leads to one status and clear selection after a successful update.

### React Query mutations

> My API already has updateLeadStatus(id, payload) and updateBulkLeadStatus(payload). Update the mutation hooks so they use those existing function signatures.

### Testing

> Give meaningful frontend and backend test cases for create, list, search, pagination, individual status updates, bulk status updates, validation, and error cases.

### Test debugging

> Vitest is reporting an empty test suite and one date-format assertion failure. Explain the failures and give the exact changes to fix them.

### Documentation

> Create a professional README.md and AGENT.md that match the assignment requirements and accurately document architecture, setup, tests, AI usage, trade-offs, and future improvements.

---

# AI-Assisted Areas

| Area | Type of assistance |
| --- | --- |
| Project architecture | Discussion and structure suggestions |
| Lead search | Debounce and validation suggestions |
| DataGrid | Styling/debugging suggestions |
| Status editing | Component/API wiring suggestions |
| Bulk updates | UI and mutation-flow suggestions |
| TanStack Query | Query/mutation invalidation patterns |
| Testing | Test-case planning and test-code drafts |
| Error debugging | Analysis of compiler/test/runtime output |
| Documentation | README and AGENT drafting |

AI assistance does not mean every line in these areas was copied directly. Generated snippets were adapted to the project's actual types, APIs, package versions, component structure, and runtime behavior.

---

# Developer-Owned Work

The developer remained responsible for the final application, including:

- selecting the final project structure
- creating and configuring the repository
- installing and configuring dependencies
- database setup
- environment configuration
- connecting PostgreSQL
- implementing/integrating the API
- connecting frontend APIs to the backend
- adapting AI suggestions to the real codebase
- resolving TypeScript and runtime errors
- manually testing UI behavior
- executing automated tests
- reviewing failing tests
- making final code changes
- managing Git history/commits
- deployment configuration
- final submission review

Where AI supplied code, the developer remained responsible for understanding, testing, and verifying it before keeping it in the project.

---

# Key Engineering Decisions

## Feature-based frontend organization

Lead-related API functions, components, hooks, types, and validation are grouped under the lead feature.

**Reason:** keeps the application easy to navigate and prevents the page component from owning all logic.

---

## TanStack Query for server state

Lead lists and mutations use TanStack Query.

**Reason:** it provides request caching, loading/error states, mutation lifecycle handling, and simple invalidation after writes.

The app invalidates/refetches lead data after successful mutations instead of maintaining another manually synchronized copy of server state.

---

## Debounced server-side search

Search is debounced before changing the API query.

**Reason:** reduces unnecessary HTTP calls while preserving a responsive typing experience.

Search values are normalized/validated before being applied.

---

## Server-side pagination

The backend owns pagination.

**Reason:** the frontend does not need to download the complete lead dataset and the approach scales better as the number of leads increases.

MUI DataGrid uses zero-based page indexes while the API uses one-based pages, so the frontend explicitly converts between them.

---

## Inline status editing

Lead status can be changed directly in the table.

**Reason:** fewer clicks and the required Update Lead Status feature is immediately visible to a reviewer.

---

## Bulk status updates

Selected rows can be updated in one bulk request.

**Reason:** avoids making one network request for every selected lead and demonstrates a useful CRM workflow beyond the minimum requirements.

---

## Transactional bulk behavior

Bulk writes should behave as one business operation.

**Reason:** prevents partial updates where some leads change while another fails.

---

## Lead journey/history

Each status change appends an entry with status, note, and timestamp.

**Reason:** preserves a simple audit trail and makes status changes traceable.

For assignment scope, this is stored with the lead. A larger production system would likely move history into a dedicated table.

---

## Layered backend

Validation, HTTP handling, business logic, and SQL/database access are separated.

**Reason:** easier testing, debugging, and maintenance with less coupling between Express and PostgreSQL.

---

## Behavior-focused frontend testing

Frontend tests focus on application behavior rather than Tailwind class names or MUI internal markup.

**Reason:** third-party DOM details can change between versions, while application behavior should stay stable.

For complex DataGrid behavior, the grid can be mocked at the component boundary while testing the application's own data mapping and callbacks.

---

# AI Output That Required Adjustment

AI suggestions were not always directly compatible with the project. Examples of adjustments made based on the real code/runtime include:

- matching React Query mutation functions to the existing API signatures
- using the actual function name `updateBulkLeadStatus`
- correcting MUI DataGrid checkbox selectors
- moving checkbox styles that had been nested under the DataGrid overlay selector
- adapting tests to the locale output of `Intl.DateTimeFormat`
- ensuring test mocks matched the current component APIs
- removing or repairing empty Vitest test files
- accounting for package/version-specific behavior

These changes were driven by real code, compiler feedback, runtime behavior, and test output rather than assuming AI-generated code was correct.

---

# Verification Process

AI-assisted work was verified using one or more of the following:

1. TypeScript/compiler feedback
2. Browser testing
3. API requests
4. PostgreSQL data inspection
5. Jest/Supertest backend tests
6. Vitest/React Testing Library frontend tests
7. Manual search/filter/pagination checks
8. Manual single and bulk status-update checks

Observed application behavior and test results were treated as the final source of truth.

---

# Security and Privacy

AI was used with implementation details and debugging output only.

Secrets such as database passwords, deployment secrets, and private API keys should never be included in prompts, this document, Git history, or committed `.env` files.

Environment variables should remain outside version control.

---

# Final Responsibility

AI was used as a productivity and reasoning tool, not as an autonomous author of the submission.

The developer reviewed and integrated the final implementation and remains responsible for:

- correctness
- code quality
- tests
- deployment
- security
- documentation
- final submission
