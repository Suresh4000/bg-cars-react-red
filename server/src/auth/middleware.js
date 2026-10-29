import { verifyAccessToken } from "./tokens.js";
import { prisma } from "../db.js";

export async function requireAuth(request, response, next) {
  const header = request.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ error: { code: "AUTH_REQUIRED", message: "Sign in to continue." } });
  }

  try {
    const claims = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: {
        id: true, organizationId: true, primaryLocationId: true, fullName: true,
        email: true, role: true, isActive: true,
        locationAccess: { select: { locationId: true } }
      }
    });
    if (!user || !user.isActive || user.organizationId !== claims.organizationId || user.role !== claims.role) {
      return response.status(401).json({ error: { code: "INVALID_SESSION", message: "Your session is no longer valid." } });
    }
    request.user = user;
    return next();
  } catch (error) {
    if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
      return response.status(401).json({ error: { code: "INVALID_TOKEN", message: "Your session is invalid or expired." } });
    }
    return next(error);
  }
}

export function requireRole(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ error: { code: "AUTH_REQUIRED", message: "Sign in to continue." } });
    }
    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: { code: "FORBIDDEN", message: "You do not have permission to perform this action." } });
    }
    return next();
  };
}

export function requireLocationAccess(getLocationId = (request) => request.params.locationId ?? request.body?.locationId ?? request.query?.locationId) {
  return async (request, response, next) => {
    const locationId = getLocationId(request);
    if (!locationId || typeof locationId !== "string") {
      return response.status(400).json({ error: { code: "LOCATION_REQUIRED", message: "A valid garage location is required." } });
    }
    try {
      const location = await prisma.garageLocation.findFirst({
        where: { id: locationId, organizationId: request.user.organizationId, isActive: true },
        select: { id: true }
      });
      if (!location) {
        return response.status(404).json({ error: { code: "LOCATION_NOT_FOUND", message: "The garage location was not found." } });
      }
      if (request.user.role === "SUPER_ADMIN") return next();

      const allowed = request.user.primaryLocationId === locationId ||
        request.user.locationAccess.some((item) => item.locationId === locationId);
      if (!allowed) {
        return response.status(403).json({ error: { code: "LOCATION_FORBIDDEN", message: "You do not have access to this garage location." } });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
