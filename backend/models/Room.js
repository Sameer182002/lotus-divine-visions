import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  size: {
    type: String,
    trim: true,
  },
  capacity: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  specialPrice: {
    type: String,
    trim: true,
  },
  specialPriceStartDate: {
    type: Date,
  },
  specialPriceEndDate: {
    type: Date,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  imageKey: {
    type: String,
    trim: true,
  },
  gallery: {
    type: [String],
    default: [],
  },
  inventory: {
    type: Number,
    default: 1, // Defaulting to 1, but Deluxe should be 14, Premium 5
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
