import test from "node:test";
import assert from "node:assert/strict";
import { requireAuth, requireRole, requireLocationAccess } from "../src/auth/middleware.js";

function responseMock() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    get headersSent() { return false; }
  };
}

test("requireAuth rejects requests without a bearer token", async () => {
  const request = { get: () => undefined };
  const response = responseMock();
  let nextCalled = false;
  await requireAuth(request, response, () => { nextCalled = true; });
  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error.code, "AUTH_REQUIRED");
  assert.equal(nextCalled, false);
});

test("requireRole rejects users without an allowed role", () => {
  const request = { user: { role: "MECHANIC" } };
  const response = responseMock();
  let nextCalled = false;
  requireRole("MANAGER")(request, response, () => { nextCalled = true; });
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error.code, "FORBIDDEN");
  assert.equal(nextCalled, false);
});

test("requireRole permits an allowed role", () => {
  const request = { user: { role: "MANAGER" } };
  const response = responseMock();
  let nextCalled = false;
  requireRole("MANAGER")(request, response, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});

test("location guard denies a branch outside the user's assigned locations", async () => {
  const request = { params: { locationId: "branch-b" }, user: { role: "MANAGER", organizationId: "org-1", primaryLocationId: "branch-a", locationAccess: [] } };
  const response = responseMock();
  let nextCalled = false;
  const lookup = async (id, organizationId) => id === "branch-b" && organizationId === "org-1" ? { id } : null;
  await requireLocationAccess(undefined, lookup)(request, response, () => { nextCalled = true; });
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error.code, "LOCATION_FORBIDDEN");
  assert.equal(nextCalled, false);
});

test("Super Admin can access any active location in their own organization", async () => {
  const request = { params: { locationId: "branch-b" }, user: { role: "SUPER_ADMIN", organizationId: "org-1", primaryLocationId: null, locationAccess: [] } };
  const response = responseMock();
  let nextCalled = false;
  const lookup = async (id, organizationId) => id === "branch-b" && organizationId === "org-1" ? { id } : null;
  await requireLocationAccess(undefined, lookup)(request, response, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});

test("location guard does not allow a location from another organization", async () => {
  const request = { params: { locationId: "foreign-branch" }, user: { role: "SUPER_ADMIN", organizationId: "org-1", primaryLocationId: null, locationAccess: [] } };
  const response = responseMock();
  let nextCalled = false;
  await requireLocationAccess(undefined, async () => null)(request, response, () => { nextCalled = true; });
  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error.code, "LOCATION_NOT_FOUND");
  assert.equal(nextCalled, false);
});
