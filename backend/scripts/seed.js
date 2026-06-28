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

  const defaultRooms = [
    {
      id: "lotus-sanctuary",
      name: "Deluxe Room",
      category: "Deluxe",
      description:
        "A well-appointed room with modern furnishings, a comfortable king-size bed, and garden views. Ideal for couples and solo travellers looking for a relaxing stay.",
      amenities: [
        "King-size bed",
        "Garden view",
        "Free Wi-Fi",
        "Smart TV",
        "Work desk",
        "En-suite bathroom",
      ],
      size: "32 sq m",
      capacity: "2 Guests",
      price: "From ₹8,000 / night",
      imageUrl: imageToBase64("room-1.jpg"),
      gallery: [
        imageToBase64("room-1.jpg"),
        imageToBase64("spa.jpg"),
        imageToBase64("pool.jpg"),
        imageToBase64("lobby.jpg"),
      ],
    },
    {
      id: "imperial-vista",
      name: "Family Suite",
      category: "Suite",
      description:
        "A spacious suite with a separate living area, perfect for families and groups. Includes a comfortable lounge, two bedrooms, and modern amenities throughout.",
      amenities: [
        "Two bedrooms",
        "Separate living area",
        "Free Wi-Fi",
        "Smart TV",
        "Mini-bar",
        "En-suite bathroom",
      ],
      size: "54 sq m",
      capacity: "4 Guests",
      price: "From ₹12,000 / night",
      imageUrl: imageToBase64("room-2.jpg"),
      gallery: [
        imageToBase64("room-2.jpg"),
        imageToBase64("dining.jpg"),
        imageToBase64("room-3.jpg"),
        imageToBase64("hero-luxury.jpg"),
      ],
    },
  ];

  console.log("Clearing existing rooms collection...");
  await Room.deleteMany({});

  console.log("Seeding base64 dynamic rooms...");
  await Room.insertMany(defaultRooms);

  console.log("Database seeding completed successfully!");
  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error("Seeding failed with error:", err);
  process.exit(1);
});
