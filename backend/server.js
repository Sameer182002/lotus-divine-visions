import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Room from "./models/Room.js";
import securityRoutes from "./routes/security.js";
import bookingRoutes from "./routes/booking.js";
import roomsRoutes from "./routes/rooms.js";
import adminRoutes from "./routes/admin.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  try {
    const count = await Room.countDocuments();
    if (count === 0) {
      console.log("\n==================================================");
      console.log("WARNING: Database is empty.");
      console.log("Please run 'npm run seed' to populate initial rooms");
      console.log("with their respective Base64 images.");
      console.log("==================================================\n");
    }
  } catch (error) {
    console.error("Error checking database status on startup:", error);
  }
});

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Cyber Security Hardening Middleware: Helmet
// Protects the server by setting secure HTTP response headers
// We disable crossOriginResourcePolicy to allow client to load uploaded room images from backend
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// 2. Cross-Origin Resource Sharing
// Allow requests from our configured frontend origin only
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocalhost =
      origin.startsWith("http://localhost:") ||
      origin.startsWith("https://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.startsWith("https://127.0.0.1:");

    if (isLocalhost || origin === process.env.CORS_ORIGIN) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 3. Body parser
// Set JSON limit to 2mb to support Base64 image uploads for new rooms
app.use(express.json({ limit: "2mb" }));

// 4. Rate Limiter (Brute-force and DDoS Mitigation)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});

const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Strict limit: max 10 booking requests per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many booking attempts. Please try again later or contact us directly." },
});

// Apply rate limiting
app.use("/api", apiLimiter);
app.use("/api/booking", bookingLimiter);

// 5. Serve static uploads folder (where room images are saved)
app.use("/uploads", express.static("uploads"));

// 6. Register Routes
app.use("/api/security", securityRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/admin", adminRoutes);

// Root route — branded status page visible at api.yourdomain.com
app.get("/", (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Lotus Divine — API Service</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Georgia', serif;
          background: #1a1209;
          color: #f5f0e8;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .card {
          border: 1px solid #c9a84c40;
          padding: 3rem 4rem;
          text-align: center;
          max-width: 480px;
          width: 100%;
          background: #221a0d;
        }
        .dot {
          width: 10px; height: 10px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .eyebrow {
          font-family: 'Arial', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 1rem;
        }
        h1 { font-size: 2rem; font-weight: normal; margin-bottom: 0.5rem; color: #f5f0e8; }
        .subtitle { color: #a09070; font-size: 0.9rem; margin-bottom: 2rem; font-family: Arial, sans-serif; }
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
          font-size: 0.85rem;
          color: #22c55e;
          margin-bottom: 2rem;
          font-weight: 600;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat {
          background: #2d2010;
          border: 1px solid #c9a84c20;
          padding: 1rem;
          font-family: Arial, sans-serif;
        }
        .stat-label { font-size: 9px; letter-spacing: 0.15em; color: #c9a84c; text-transform: uppercase; margin-bottom: 0.25rem; }
        .stat-value { font-size: 1rem; color: #f5f0e8; font-weight: 600; }
        .divider { border: none; border-top: 1px solid #c9a84c20; margin: 1.5rem 0; }
        .endpoints { text-align: left; font-family: monospace; font-size: 0.78rem; color: #a09070; line-height: 2; }
        .endpoints span { color: #c9a84c; }
        .footer { margin-top: 2rem; font-family: Arial, sans-serif; font-size: 0.75rem; color: #6b5a3e; }
      </style>
    </head>
    <body>
      <div class="card">
        <p class="eyebrow">API Service</p>
        <h1>Lotus Divine</h1>
        <p class="subtitle">Hotel Backend Microservice</p>
        <div class="status">
          <span class="dot"></span> Service is running
        </div>
        <div class="grid">
          <div class="stat">
            <div class="stat-label">Environment</div>
            <div class="stat-value">${process.env.NODE_ENV || "development"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Uptime</div>
            <div class="stat-value">${hours}h ${minutes}m ${seconds}s</div>
          </div>
          <div class="stat">
            <div class="stat-label">Version</div>
            <div class="stat-value">1.0.0</div>
          </div>
          <div class="stat">
            <div class="stat-label">Port</div>
            <div class="stat-value">${process.env.PORT || 5001}</div>
          </div>
        </div>
        <hr class="divider" />
        <div class="endpoints">
          <span>GET</span>  /api/rooms<br/>
          <span>GET</span>  /api/security/key<br/>
          <span>POST</span> /api/booking<br/>
          <span>POST</span> /api/admin/login<br/>
          <span>GET</span>  /api/admin/bookings<br/>
          <span>GET</span>  /health
        </div>
        <p class="footer">© ${new Date().getFullYear()} Lotus Divine Hotels. All rights reserved.</p>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint — JSON, for monitoring tools like UptimeRobot
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "lotus-divine-backend",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 7. Generic Error Handling Middleware (Security Best Practice: Do not leak stack traces)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
