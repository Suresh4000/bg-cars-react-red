import { Router } from "express";
import bcrypt from "bcryptjs";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../db.js";
import { requireAuth } from "../auth/middleware.js";
import { createAccessToken, createRefreshToken, hashRefreshToken } from "../auth/tokens.js";

const router = Router();
const refreshCookieName = "gms_refresh";
const refreshLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth",
  maxAge: refreshLifetimeMs
};
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { code: "LOGIN_RATE_LIMITED", message: "Too many sign-in attempts. Try again later." } }
});

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
    primaryLocationId: user.primaryLocationId,
    locationIds: [
      ...new Set([
        ...(user.primaryLocationId ? [user.primaryLocationId] : []),
        ...(user.locationAccess ?? []).map((item) => item.locationId)
      ])
    ]
  };
}

async function issueSession(user, response, oldSessionId = null) {
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + refreshLifetimeMs);
  await prisma.$transaction(async (tx) => {
    if (oldSessionId) await tx.refreshSession.delete({ where: { id: oldSessionId } });
    await tx.refreshSession.create({
      data: { userId: user.id, tokenHash: hashRefreshToken(refreshToken), expiresAt }
    });
  });
  response.cookie(refreshCookieName, refreshToken, cookieOptions);
  return { accessToken: createAccessToken(user), tokenType: "Bearer", expiresIn: 900, user: publicUser(user) };
}

router.post("/login", loginLimiter, async (request, response, next) => {
  try {
    const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
    const password = typeof request.body?.password === "string" ? request.body.password : "";
    if (!email || !password || email.length > 254 || password.length > 1024) {
      return response.status(400).json({ error: { code: "INVALID_INPUT", message: "Enter a valid email and password." } });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { locationAccess: { select: { locationId: true } } }
    });
    const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !user.isActive || !passwordMatches) {
      return response.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." } });
    }
    return response.status(200).json(await issueSession(user, response));
  } catch (error) {
    return next(error);
  }
});

router.post("/refresh", async (request, response, next) => {
  try {
    const token = request.cookies?.[refreshCookieName];
    if (!token || typeof token !== "string") {
      return response.status(401).json({ error: { code: "REFRESH_REQUIRED", message: "Sign in again to continue." } });
    }
    const session = await prisma.refreshSession.findUnique({
      where: { tokenHash: hashRefreshToken(token) },
      include: { user: { include: { locationAccess: { select: { locationId: true } } } } }
    });
    if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
      if (session) await prisma.refreshSession.delete({ where: { id: session.id } });
      response.clearCookie(refreshCookieName, { ...cookieOptions, maxAge: undefined });
      return response.status(401).json({ error: { code: "REFRESH_INVALID", message: "Your session expired. Please sign in again." } });
    }
    return response.status(200).json(await issueSession(session.user, response, session.id));
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", async (request, response, next) => {
  try {
    const token = request.cookies?.[refreshCookieName];
    if (token && typeof token === "string") {
      await prisma.refreshSession.deleteMany({ where: { tokenHash: hashRefreshToken(token) } });
    }
    response.clearCookie(refreshCookieName, { ...cookieOptions, maxAge: undefined });
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (request, response) => {
  return response.status(200).json({ user: publicUser(request.user) });
});

export default router;
