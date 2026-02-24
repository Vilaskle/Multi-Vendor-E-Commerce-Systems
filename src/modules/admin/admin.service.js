// import Vendor from "../../models/Vendor.js";
// import Admin from "../../models/Admin.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// // ================= ADMIN LOGIN =================
// export const adminLoginService = async (email, password) => {
//   const admin = await Admin.findOne({ email });

//   if (!admin) throw new Error("Invalid email or password");

//   const isMatch = await bcrypt.compare(password, admin.password);

//   if (!isMatch) throw new Error("Invalid email or password");

//   const token = jwt.sign(
//     { adminId: admin._id, role: admin.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   return {
//     token,
//     id: admin._id,
//     name: admin.name,
//     email: admin.email,
//   };
// };

// // ================= GET ALL VENDORS =================
// export const getAllVendorsService = async () => {
//   return await Vendor.find().sort({ createdAt: -1 });
// };

// // ================= GET PENDING VENDORS =================
// export const getPendingVendorsService = async () => {
//   return await Vendor.find({ status: "PENDING" }).sort({ createdAt: -1 });
// };

// // ================= APPROVE VENDOR =================
// export const approveVendorService = async (vendorId) => {
//   const vendor = await Vendor.findById(vendorId);

//   if (!vendor) throw new Error("Vendor not found");

//   vendor.status = "APPROVED";
//   await vendor.save();

//   return vendor;
// };

// // ================= REJECT VENDOR =================
// export const rejectVendorService = async (vendorId, reason) => {
//   const vendor = await Vendor.findById(vendorId);

//   if (!vendor) throw new Error("Vendor not found");

//   vendor.status = "REJECTED";
//   vendor.rejectionReason = reason || "Not provided";

//   await vendor.save();

//   return vendor;
// };


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";


export const adminLoginService = async (email, password) => {
  // const admin = await Admin.findOne({ email }).select("+password");
const admin = await Admin.findOne({ email }).select("+password");

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