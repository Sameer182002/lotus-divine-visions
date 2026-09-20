import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  singletonKey: {
    type: String,
    default: "GLOBAL_SETTINGS",
    unique: true,
  },
  isCouponLive: {
    type: Boolean,
    default: false,
  },
  couponCode: {
    type: String,
    trim: true,
    default: "",
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  marqueeText: {
    type: String,
    trim: true,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt timestamp
SettingsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings;
