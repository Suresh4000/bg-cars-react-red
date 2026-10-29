import test from "node:test";
import assert from "node:assert/strict";
import { requireRole, requireLocationAccess } from "../src/auth/middleware.js";

function responseMock() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

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

test("location guard denies a branch outside the user's assigned locations", () => {
  const request = { params: { locationId: "branch-b" }, user: { role: "MANAGER", primaryLocationId: "branch-a", locationAccess: [] } };
  const response = responseMock();
  let nextCalled = false;
  requireLocationAccess()(request, response, () => { nextCalled = true; });
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error.code, "LOCATION_FORBIDDEN");
  assert.equal(nextCalled, false);
});

test("Super Admin can access any requested garage location", () => {
  const request = { params: { locationId: "branch-b" }, user: { role: "SUPER_ADMIN", primaryLocationId: null, locationAccess: [] } };
  const response = responseMock();
  let nextCalled = false;
  requireLocationAccess()(request, response, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});
