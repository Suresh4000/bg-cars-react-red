import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("health endpoint reports service status", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "bay-view-gms-api");
  assert.equal(typeof response.body.timestamp, "string");
});

test("unknown routes return a structured 404", async () => {
  const response = await request(app).get("/api/not-a-real-route");
  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, "NOT_FOUND");
});
