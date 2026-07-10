import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import therapistRoutes from "./routes/therapistRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import paymentMethodRoutes from "./routes/paymentMethodRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

console.log("✅ app.js loaded");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CORS ────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://zenithspa.online",
  "https://www.zenithspa.online",
  "https://zenith-spa-xi.vercel.app",
  "https://zenith-spa.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      console.log("Incoming Origin:", JSON.stringify(origin));
      if (!origin) return callback(null, true);
      const normalized = origin.trim();
      if (allowedOrigins.includes(normalized)) {
        console.log("✅ CORS Allowed:", normalized);
        return callback(null, true);
      }
      console.error("❌ CORS Blocked:", normalized);
      return callback(new Error(`Origin ${normalized} is not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: false,
  })
);

// Handle OPTIONS preflight explicitly
app.options("*", cors());

// ─── Body Parsers ────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Uploads ──────────────────────────────────────────────────────────

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Health Check ────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Zenith Spa API is running" });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error("\n================ SERVER ERROR ================");
  console.error("Time:", new Date().toISOString());
  console.error("Route:", req.method, req.originalUrl);
  console.error("Name:", err.name);
  console.error("Message:", err.message);
  if (err.stack) console.error(err.stack);
  console.error("==============================================\n");
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development"
      ? { name: err.name, message: err.message, stack: err.stack }
      : undefined,
  });
});

export default app;
