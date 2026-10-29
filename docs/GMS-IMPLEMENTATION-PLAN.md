# Bay View Garage Management System — Implementation Plan

## Confirmed product decisions
- One garage business operating multiple physical locations.
- Roles: Super Admin, Manager, Receptionist, Mechanic, Customer and HR Manager.
- Existing frontend: React + Vite. API: Node.js + Express. Database: PostgreSQL + Prisma.
- Cloud hosting; core garage workflow takes priority over secondary modules.

## Multi-location rules
1. Customer and vehicle records are shared within the organization.
2. Bookings, job cards, stock movements, staff assignments and financial transactions are tied to a garage location.
3. Super Admin can manage all locations; branch staff must be restricted by server-side authorization.
4. Customer accounts can access only their own vehicles, bookings, job cards, invoices and notifications.
5. Every applicable request must validate organization and location ownership to prevent cross-branch or cross-organization data exposure.

## Delivery milestones
1. Repository review, architecture and data model.
2. Backend foundation, database, authentication, roles and location permissions.
3. Customers, vehicles and bookings.
4. Job cards, mechanic assignment, diagnosis, estimates/approval, labour/parts, quality checks and delivery.
5. Inventory, purchasing, invoices, payments and GST configuration.
6. Dashboards, reports, notifications and delivery logs/retries.
7. Customer portal, HR/attendance/payroll, insurance, fleet/membership, warranty, equipment maintenance and feedback.
8. Automated tests, security hardening, monitoring, encrypted backups, restore tests and cloud launch.

## Phase 2 — Authentication and location access (implementation started)
- Added short-lived signed access tokens and hashed, rotating refresh sessions stored in PostgreSQL.
- Added login, refresh, logout and current-user endpoints.
- Added active-user validation, role authorization helper and organization-scoped garage-location access helper.
- Added a one-time bootstrap script for the initial Super Admin; it refuses to run after users exist.
- Added tests for unauthenticated access, role restrictions and branch isolation.
- Remaining before phase completion: confirm CI passes on the latest commit, validate the schema/migration on a local PostgreSQL instance, and review production cookie/secret configuration.

## Current foundation scope
- Isolated Express API in server/ to avoid replacing the current website.
- PostgreSQL/Prisma model for organization, locations, users, customers, vehicles, bookings and job cards.
- Health endpoint, security headers, CORS allow-list, JSON size limit, rate limit and structured error responses.
- API smoke tests and environment example with placeholder values.

## Known limitations and decisions to confirm
- This is only the initial foundation; auth and operational modules are not implemented yet.
- Validate Prisma schema and migrations locally before treating the database as deployable.
- Confirm GST/invoice numbering, warranty rules, cancellation/refund policy, mechanic incentives and preferred notification channel with the business owner.
- The existing repository README says the public website source is a reconstruction, not a byte-for-byte recovery. Compare against the deployed site before changing public-facing UI.
