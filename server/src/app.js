import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (_request, response) => response.status(200).json({
  status: "ok", service: "bay-view-gms-api", timestamp: new Date().toISOString()
}));
app.use("/api/auth", authRoutes);

app.use((_request, response) => response.status(404).json({
  error: { code: "NOT_FOUND", message: "The requested API route was not found." }
}));

app.use((error, _request, response, _next) => {
  if (response.headersSent) return;
  const isCorsError = error?.message === "Origin is not allowed by CORS";
  response.status(isCorsError ? 403 : 500).json({
    error: {
      code: isCorsError ? "CORS_ORIGIN_DENIED" : "INTERNAL_SERVER_ERROR",
      message: isCorsError ? "This origin is not allowed." : "An unexpected server error occurred."
    }
  });
});
export default app;
