import mongoose from "mongoose";

const platformSettingsSchema = new mongoose.Schema({
  deliveryMode: {
    type: String,
    enum: ["ADMIN", "VENDOR"],
    default: "ADMIN",
  },

  adminDeliveryCharge: {
    type: Number,
    default: 40,
  },

  freeDeliveryThreshold: {
    type: Number,
    default: 999,
  },
}, { timestamps: true });

export default mongoose.model("PlatformSettings", platformSettingsSchema);