// import mongoose from "mongoose";
// import Product from "../models/Product.js";
// import dotenv from "dotenv";

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// const vendorId = "69858ad38586fd100f32fc46"; // 👈 your dummy vendor

// const seedProducts = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("MongoDB connected");

//     await Product.deleteMany(); // optional (cleans old dummy data)

//     const products = [
//       {
//         name: "Men Cotton T-Shirt",
//         category: "Men",
//         productType: "T-Shirt",
//         price: 799,
//         quantity: 50,
//         sizes: ["S", "M", "L", "XL"],
//         colors: ["Black", "White"],
//         images: [
//           {
//             url: "https://res.cloudinary.com/diq9pfjdj/image/upload/v1771310026/Men_Cotton_T-Shirt_nqix0k.jpg",
//             public_id: "sample_1",
//           },
//         ],
//         vendor: vendorId,
//       },
//       {
//         name: "Women Floral Dress",
//         category: "Women",
//         productType: "Dress",
//         price: 1499,
//         quantity: 30,
//         sizes: ["M", "L"],
//         colors: ["Red", "Blue"],
//         images: [
//           {
//             url: "https://res.cloudinary.com/diq9pfjdj/image/upload/v1771309945/Women_Floral_Dress_lhstba.jpg://res.cloudinary.com/demo/image/upload/sample.jpg",
//             public_id: "sample_2",
//           },
//         ],
//         vendor: vendorId,
//       },
//     ];

//     await Product.insertMany(products);

//     console.log("Dummy products inserted successfully");
//     process.exit();
//   } catch (error) {
//     console.error("Error seeding products:", error);
//     process.exit(1);
//   }
// };

// seedProducts();


// import dotenv from "dotenv";
// dotenv.config();

// import connectDB from "../config/db.js";
// import cloudinary from "../config/cloudinary.js";
// import Product from "../models/Product.js";

// import PRODUCTS from "./products.js"; // 👈 your big PRODUCTS array
// import { SIZE_RULES, COLOR_RULES } from "../constants/productRules.js";

// const DUMMY_VENDOR_ID = "69858ad38586fd100f32fc46"; // replace with real vendor id if needed

// const getSizes = (category, tags = []) => {
//   const cat = category.toLowerCase();

//   if (tags.includes("topwear")) return SIZE_RULES[cat]?.topwear || [];
//   if (tags.includes("bottomwear")) return SIZE_RULES[cat]?.bottomwear || [];

//   return [];
// };

// const getColors = (category) => {
//   return COLOR_RULES[category.toLowerCase()] || [];
// };

// const uploadImage = async (imageUrl, name) => {
//   const result = await cloudinary.uploader.upload(imageUrl, {
//     folder: "products",
//     public_id: name.replace(/\s+/g, "-").toLowerCase(),
//   });

//   return {
//     url: result.secure_url,
//     public_id: result.public_id,
//   };
// };

// const seedProducts = async () => {
//   try {
//     await connectDB();
//     await Product.deleteMany();

//     for (const item of PRODUCTS) {
//       const image = await uploadImage(item.image, item.name);

//       await Product.create({
//         name: item.name,
//         category:
//           item.category.charAt(0).toUpperCase() + item.category.slice(1),
//         tags: item.tags || [],
//         price: item.price,
//          discount: item.discount || 0, 
//         stock: item.stock, // ✅ renamed
//         sizes: getSizes(item.category, item.tags),
//         colors: getColors(item.category),
//         images: [image],
//         vendor: DUMMY_VENDOR_ID,
//       });

//       console.log(`Seeded: ${item.name}`);
//     }

//     console.log("✅ Products seeded successfully");
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedProducts();

import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

import PRODUCTS from "./products.js";
import { SIZE_RULES, COLOR_RULES } from "../constants/productRules.js";

/* ================= CONFIG ================= */

const VENDOR_ID = "69858ad38586fd100f32fc46"; // replace with real vendor id

const FALLBACK_IMAGE = {
  url: "https://res.cloudinary.com/diq9pfjdj/image/upload/v1771399111/Mens_rha4pa.jpg",
  public_id: "fallback-image",
};

/* ================= HELPERS ================= */

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const getSizes = (category, tags = []) => {
  const cat = category.toLowerCase();

  if (tags.includes("topwear"))
    return SIZE_RULES[cat]?.topwear || [];

  if (tags.includes("bottomwear"))
    return SIZE_RULES[cat]?.bottomwear || [];

  return [];
};

const getColors = (category) =>
  COLOR_RULES[category.toLowerCase()] || [];

/* ================= RATING HELPERS ================= */

const generateRating = () => {
  const rating = Math.random() * (5 - 3) + 3; // 3.0 → 5.0
  return Math.round(rating * 10) / 10;        // 1 decimal
};

const generateNumReviews = () => {
  return Math.floor(Math.random() * 496) + 5; // 5 → 500
};

/* ================= CLOUDINARY UPLOAD ================= */

const uploadImageToCloudinary = async (imageUrl, productName, vendorId) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `vendors/${vendorId}/products`,
      public_id: productName.replace(/\s+/g, "-").toLowerCase(),
      timeout: 60000,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(`❌ Image upload failed for: ${productName}`);
    return null; // IMPORTANT
  }
};

/* ================= SEED FUNCTION ================= */

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    console.log("🗑️ Old products removed");

    let successImages = 0;
    let fallbackImages = 0;

    for (const item of PRODUCTS) {
      let imageData = await uploadImageToCloudinary(
        item.image,
        item.name,
        VENDOR_ID
      );

      /* ================= FALLBACK IMAGE ================= */
      if (!imageData) {
        imageData = FALLBACK_IMAGE;
        fallbackImages++;
      } else {
        successImages++;
      }

      await Product.create({
        name: item.name,

        category: capitalize(item.category), // Men / Women / Kids
        tags: item.tags || [],

        price: item.price,
        discount: item.discount || 0,
        stock: item.stock,

        sizes: getSizes(item.category, item.tags),
        colors: getColors(item.category),

        /* ================= RATING ================= */
        rating: generateRating(),
        numReviews: generateNumReviews(),

        images: [imageData],
        vendor: VENDOR_ID,
      });

      console.log(`✅ Saved: ${item.name}`);

      // ⏳ avoid Cloudinary rate limit
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log("🎉 SEED COMPLETED");
    console.log(`🖼️ Cloudinary uploads: ${successImages}`);
    console.log(`🧩 Fallback images used: ${fallbackImages}`);

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
