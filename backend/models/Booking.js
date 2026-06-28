import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  guests: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  guestName: {
    type: String,
    required: true,
    trim: true,
  },
  guestPhone: {
    type: String,
    trim: true,
  },
  guestEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  arrivalTime: {
    type: String,
    trim: true,
  },
  specialRequest: {
    type: String,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Confirmed", "Cancelled"],
    default: "Confirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
