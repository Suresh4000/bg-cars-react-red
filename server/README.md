# Bay View GMS API

Backend foundation for the multi-location garage management system.

## Requirements
- Node.js 20 or newer
- PostgreSQL 15 or newer (local or hosted)

## Local setup
1. Open a terminal in the `server` directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env`; set a local PostgreSQL `DATABASE_URL` and a unique `JWT_ACCESS_SECRET` (at least 32 characters).
4. Run `npm run prisma:generate`.
5. Run `npm run prisma:validate`.
6. Apply the schema to a disposable development database with `npm run db:push`.
7. Start the API with `npm run dev`.
8. Visit `http://localhost:4000/api/health`.

For shared or production databases, use reviewed Prisma migrations rather than `db:push`.

## Authentication endpoints
- `POST /api/auth/login` — accepts JSON `{ "email": "...", "password": "..." }`; returns a short-lived access token and sets an HTTP-only refresh cookie.
- `POST /api/auth/refresh` — rotates the refresh session and returns a new access token.
- `POST /api/auth/logout` — revokes the refresh session and clears the cookie.
- `GET /api/auth/me` — requires `Authorization: Bearer <accessToken>`.

Access tokens expire after 15 minutes. Refresh sessions expire after seven days and are stored as SHA-256 hashes. Login returns a generic credential error and is rate-limited. Password hashes must be created using bcrypt; do not store plain-text passwords.

## Authorization helpers
- `requireAuth` validates the access token and reloads the active user from the database.
- `requireRole(...roles)` restricts route access by role.
- `requireLocationAccess()` checks a requested garage location against the user's primary and assigned locations; Super Admin is limited to their own organization.

These helpers must be applied to every protected business route. Adding a helper does not automatically secure routes that do not use it.

## Tests
Run `npm test` from this directory.

## Current limitations
This is not yet a production-ready application. There are no user registration or password-reset routes, no admin user-management routes, and no database-backed customer/vehicle/booking workflows yet. Create initial admin accounts through a reviewed, secure seed procedure; do not add a public registration endpoint for staff. Do not deploy this as a live service until schema/migrations, permission checks and production security settings have been reviewed.
