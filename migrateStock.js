import mongoose from "mongoose";
import Product from "./src/models/Product.js";

await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find({ quantity: { $exists: true } });

for (const p of products) {

  p.stock = p.quantity;
  p.quantity = undefined;

  await p.save();
}

console.log("Stock migration completed");

process.exit();