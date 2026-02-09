import Vendor from "../../models/Vendor.js";
import jwt from "jsonwebtoken";
import { sendVendorEmailOtp } from "../../services/email/email.service.js";
import Product from "../../models/Product.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";

export const registerVendorService = async ({
  name,
  email,
  phoneNo,
}) => {
  const existingVendor = await Vendor.findOne({
    $or: [{ email }, { phoneNo }],
  });

  if (existingVendor) {
    throw new Error("Vendor already registered");
  }

  const vendor = await Vendor.create({
    name,
    email,
    phoneNo,
  });

  return {
    id: vendor._id,
    name: vendor.name,
    email: vendor.email,
    status: vendor.status,
  };
};


// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// STEP 1: REQUEST OTP
export const requestVendorLoginOtpService = async (email) => {
  const vendor = await Vendor.findOne({ email });

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status !== "APPROVED") {
    throw new Error("Vendor is not approved by admin");
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  vendor.emailOtp = otp;
  vendor.emailOtpExpiry = expiry;
  await vendor.save();

  await sendVendorEmailOtp(email, otp);
};

// STEP 2: VERIFY OTP
export const verifyVendorLoginOtpService = async (email, otp) => {
  const vendor = await Vendor.findOne({ email });

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (
    vendor.emailOtp !== otp ||
    vendor.emailOtpExpiry < new Date()
  ) {
    throw new Error("Invalid or expired OTP");
  }

  // Clear OTP
  vendor.emailOtp = null;
  vendor.emailOtpExpiry = null;
  await vendor.save();

  // Generate JWT
  const token = jwt.sign(
    { vendorId: vendor._id, role: vendor.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    vendor: {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      status: vendor.status,
    },
  };
};



// GET PROFILE
export const getVendorProfileService = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId).select(
    "-emailOtp -emailOtpExpiry"
  );

  if (!vendor) throw new Error("Vendor not found");

  return vendor;
};

// UPDATE PROFILE
export const updateVendorProfileService = async (vendorId, updateData) => {
  const allowedFields = {};

  if (updateData.name) allowedFields.name = updateData.name;
  if (updateData.phoneNo) allowedFields.phoneNo = updateData.phoneNo;

  const vendor = await Vendor.findByIdAndUpdate(
    vendorId,
    { $set: allowedFields },
    { new: true }
  ).select("-emailOtp -emailOtpExpiry");

  if (!vendor) throw new Error("Vendor not found");

  return vendor;
};


export const addProductService = async ({
 name,
  category,
  productType,
  price,
  quantity,
  sizes,
  colors,
  vendorId,
  files,
}) => {
  try {
    const images = [];

    for (const file of files) {
      const result = await uploadToCloudinary(
        file.buffer,
        `vendors/${vendorId}/products`
      );

      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const product = await Product.create({
      name,
    category,
    productType,
    price,
    quantity,
    sizes,
    colors,
    vendor: vendorId,
    images,
    });

    return product;
  } catch (err) {
    console.error("SERVICE ERROR (addProduct):", err);
    throw err; 
  }
};




// export const addProductService = async ({
//   name,
//   price,
//   category,
//   description,
//   vendorId,
//   files,
// }) => {
//   // Convert uploaded files to image array
//   const images = files.map((file) => ({
//     url: file.path,        // Cloudinary URL
//     public_id: file.filename, // Cloudinary public_id
//   }));

//   const product = await Product.create({
//     name,
//     price,
//     category,
//     description,
//     vendor: vendorId,
//     images,
//   });

//   return product;
// };