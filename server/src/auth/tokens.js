import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

export function getJwtSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

export function createAccessToken(user) {
  return jwt.sign(
    { role: user.role, organizationId: user.organizationId },
    getJwtSecret(),
    { subject: user.id, expiresIn: "15m", issuer: "bay-view-gms", audience: "bay-view-gms-api" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    issuer: "bay-view-gms",
    audience: "bay-view-gms-api"
  });
}

export function createRefreshToken() {
  return randomBytes(48).toString("base64url");
}

export function hashRefreshToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
