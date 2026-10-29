# Bay View GMS API

Initial backend foundation for the multi-location garage management system.

## Requirements
- Node.js 20 or newer
- PostgreSQL 15 or newer (local or hosted)

## Local setup
1. Open a terminal in the `server` directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and update `DATABASE_URL` for your local PostgreSQL instance.
4. Run `npm run prisma:generate`.
5. Run `npm run prisma:validate`.
6. Apply the initial schema to a disposable development database with `npm run db:push`.
7. Start the API with `npm run dev`.
8. Visit `http://localhost:4000/api/health`.

For a shared or production database, use reviewed Prisma migrations rather than `db:push`.

## Tests
Run `npm test` from this directory.

## Current limitations
This is not yet a production-ready application. Authentication, permission middleware, database-backed routes, migrations, and operational modules are still pending. Do not put real customer data into this foundation or deploy it as a live service until those controls are implemented and tested.
