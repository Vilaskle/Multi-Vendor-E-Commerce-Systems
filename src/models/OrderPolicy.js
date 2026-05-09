import mongoose from "mongoose";

const orderPolicySchema = new mongoose.Schema({
  cancellationWindowDays: {
    type: Number,
    default: 3, // default 3 days
  },
  returnWindowDays: {
    type: Number,
    default: 7,
  },

  exchangeWindowDays: {
    type: Number,
    default: 7,
  },

}, { timestamps: true });

export default mongoose.model("OrderPolicy", orderPolicySchema);