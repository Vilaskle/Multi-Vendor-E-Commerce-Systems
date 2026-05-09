import mongoose from "mongoose";
import OrderPolicy from "../models/OrderPolicy.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB connected");

    await OrderPolicy.create({
      cancellationWindowDays: 3,
      returnWindowDays: 7
    });

    console.log("Policy added ✅");
    process.exit();
  })
  .catch(err => console.log(err));