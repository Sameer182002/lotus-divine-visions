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
    required: false,
    trim: true,
    lowercase: true,
    default: "",
  },
  consent: {
    given: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
    _id: false,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Failed"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    default: "PayU",
  },
  payuTxnId: {
    type: String,
    trim: true,
    default: "",
  },
  payuMihpayid: {
    type: String,
    trim: true,
    default: "",
  },
  payuMode: {
    type: String,
    trim: true,
    default: "",
  },
  payuStatus: {
    type: String,
    trim: true,
    default: "",
  },
  source: {
    type: String,
    enum: ["online", "offline"],
    default: "online",
  },
  whatsappOptIn: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
