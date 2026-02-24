import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";


dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("abhishek@7019", 10);

  await Admin.create({
    name: "Admin",
    email: "abhishekangadi2004@gmail.com",
    password: hashedPassword,
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();
