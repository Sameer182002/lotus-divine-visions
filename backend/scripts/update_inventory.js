import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "../models/Room.js";
import connectDB from "../config/db.js";

dotenv.config();

async function updateInventory() {
  try {
    await connectDB();
    console.log("Connected to MongoDB.");

    // Update Deluxe Rooms
    const deluxeResult = await Room.updateMany(
      { category: "Deluxe" },
      { $set: { inventory: 14, price: "1500", weekendPrice: "2000" } },
    );
    console.log(`Updated ${deluxeResult.modifiedCount} Deluxe rooms.`);

    // Update Premium Rooms
    const premiumResult = await Room.updateMany(
      { category: "Premium" },
      { $set: { inventory: 5, price: "2000", weekendPrice: "2500" } },
    );
    console.log(`Updated ${premiumResult.modifiedCount} Premium rooms.`);

    // Update any other rooms
    const otherResult = await Room.updateMany(
      { category: { $nin: ["Deluxe", "Premium"] } },
      { $set: { inventory: 1, price: "1500", weekendPrice: "1500" } },
    );
    console.log(`Updated ${otherResult.modifiedCount} other rooms.`);

    console.log("Inventory update complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating inventory:", error);
    process.exit(1);
  }
}

updateInventory();
