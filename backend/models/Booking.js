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
  rooms: {
    type: [
      {
        roomId: { type: String, required: true },
        guests: { type: Number, required: true, min: 1 },
        _id: false,
      },
    ],
    required: true,
    validate: {
      validator: (rooms) => Array.isArray(rooms) && rooms.length > 0,
      message: "At least one room is required",
    },
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
  consent: {
    given: { type: Boolean, required: true },
    timestamp: { type: Date, required: true },
    _id: false,
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
