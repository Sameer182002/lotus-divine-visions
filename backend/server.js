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

// Root route for status check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: Date.now() });
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
