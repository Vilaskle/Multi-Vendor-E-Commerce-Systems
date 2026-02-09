import Vendor from "../../models/Vendor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";


export const adminLoginService = async (email, password) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      adminId: admin._id,
      role: admin.role, // "ADMIN"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
      id: admin._id,
      name: admin.name,
      email: admin.email,
  };
};

// Get all vendors
export const getAllVendorsService = async () => {
  return await Vendor.find().select("-__v");
};

// Approve vendor
export const approveVendorService = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status === "APPROVED") {
    throw new Error("Vendor already approved");
  }

  vendor.status = "APPROVED";
  await vendor.save();

  return vendor;
};

// Reject vendor
export const rejectVendorService = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  vendor.status = "REJECTED";
  await vendor.save();

  return vendor;
};
