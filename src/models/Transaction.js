

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  actorType: {
    type: String,
    enum: ["ADMIN", "VENDOR"],
    required: true,
  },

  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  source: {
    type: String,
    enum: ["ORDER", "REFUND", "SETTLEMENT"],
  },

  referenceId: mongoose.Schema.Types.ObjectId, // orderId

}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  actorType: {
    type: String,
    enum: ["ADMIN", "VENDOR"],
    required: true,
  },

  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  source: {
    type: String,
    enum: ["ORDER", "REFUND", "SETTLEMENT"],
  },

  referenceId: mongoose.Schema.Types.ObjectId, // orderId

}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);