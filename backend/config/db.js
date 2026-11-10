import mongoose from "mongoose";

// Disable command buffering globally so queries fail fast if MongoDB is offline
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if MongoDB is down (default 30s)
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Auto-normalize room capacity configuration so Premium room stays 2 Guests across environments
    import("../models/Room.js").then(({ default: Room }) => {
      Room.updateMany(
        { $or: [{ id: "imperial-vista" }, { category: "Premium" }, { capacity: "Up to 4 Guests" }] },
        { $set: { capacity: "2 Guests" } },
      ).catch(() => {});
    });
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
