import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import { SIZE_RULES, COLOR_RULES } from "../constants/productRules.js";

const fixKidsRules = async () => {
  try {
    await connectDB();

    const kidsProducts = await Product.find({
      category: /kids/i,
    });

    console.log(`👶 Found ${kidsProducts.length} kids products`);

    for (const product of kidsProducts) {
      let sizes = [];

      // Apply size rules based on tags
      if (product.tags?.includes("bottomwear")) {
        sizes = SIZE_RULES.kids.bottomwear;
      } else {
        // default kids = topwear
        sizes = SIZE_RULES.kids.topwear;
      }

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            sizes,
            colors: COLOR_RULES.kids,
          },
        }
      );

      console.log(`✅ Updated: ${product.name}`);
    }

    console.log("🎉 Kids size & color rules fixed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fix failed:", error);
    process.exit(1);
  }
};

fixKidsRules();
