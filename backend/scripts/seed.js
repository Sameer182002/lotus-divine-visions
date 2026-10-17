import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Room from "../models/Room.js";

// Load backend .env configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, "../../src/assets");

function imageToBase64(fileName) {
  const filePath = path.join(assetsDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`Asset image file not found: ${filePath}`);
    return "";
  }
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase().replace(".", "");
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";
  return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("Error: MONGODB_URI is not defined in the environment.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("Connected successfully.");

  console.log("Converting static room asset images to Base64...");

  const ROOM_AMENITIES = [
    "King-size bed",
    "Air conditioning",
    "Free Wi-Fi",
    "Smart TV",
    "Work desk & chair",
    "Wardrobe with hangers",
    "Blackout curtains",
    "24-hour hot & cold water",
  ];

  const defaultRooms = [
    {
      id: "lotus-sanctuary",
      name: "Deluxe",
      category: "Deluxe",
      description:
        "A comfortable, well-appointed room with a king-size bed and everything you need for a relaxing stay near the Golden Temple.",
      amenities: ROOM_AMENITIES,
      size: "11 × 12 FT",
      capacity: "2 Guests",
      price: "From ₹1,500 / night",
      inventory: 14,
      imageKey: "room1",
      imageAlt: "Deluxe room at Lotus Divine",
      imageUrl: imageToBase64("room-deluxe.jpg"),
      gallery: [imageToBase64("room-deluxe.jpg")],
      isActive: true,
    },
    {
      id: "imperial-vista",
      name: "Premium",
      category: "Premium",
      description:
        "A more spacious room with a king-size bed, ideal if you want extra room to relax.",
      amenities: ROOM_AMENITIES,
      size: "15 × 12 FT",
      capacity: "Up to 4 Guests",
      price: "From ₹2,000 / night",
      inventory: 5,
      imageKey: "room2",
      imageAlt: "Premium room at Lotus Divine",
      imageUrl: imageToBase64("room-premium.jpg"),
      gallery: [imageToBase64("room-premium.jpg")],
      isActive: true,
    },
  ];

  console.log("Clearing existing rooms collection...");
  await Room.deleteMany({});

  console.log("Seeding accurate dynamic rooms matching frontend...");
  await Room.insertMany(defaultRooms);

  console.log("Database seeding completed successfully!");
  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error("Seeding failed with error:", err);
  process.exit(1);
});
