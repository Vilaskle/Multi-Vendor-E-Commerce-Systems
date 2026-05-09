import Vendor from "../../models/Vendor.js";
import Order from "../../models/Order.js";
import jwt from "jsonwebtoken";
import  {sendOtpEmail,sendVendorStatusEmail }  from "../../services/email/email.service.js";
import Product from "../../models/Product.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";

/* ============================================================
   REGISTER VENDOR (NO OTP – ALWAYS PENDING)
============================================================ */
export const registerVendorService = async ({
  name,
  email,
  phoneNo,
  gstNumber,
  shopLicenseFile,
}) => {
  const existingVendor = await Vendor.findOne({
    $or: [{ email }, { phoneNo }, { gstNumber }],
  });

  if (existingVendor) {
    throw new Error("Vendor already registered");
  }

  const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;

  if (!gstRegex.test(gstNumber)) {
    throw new Error("Invalid GST Number");
  }

  const uploadResult = await uploadToCloudinary(
    shopLicenseFile.buffer,
    "vendors/documents",
    shopLicenseFile.mimetype
  );

  const vendor = await Vendor.create({
    name,
    email,
    phoneNo,
    gstNumber,
    shopLicense: {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    },
    status: "PENDING",
  });

  // ── ADD THIS ONE LINE ──────────────────────────────────────────────────────
  await sendVendorStatusEmail({
    to: email,
    vendorName: name,
    status: "UNDER_REVIEW",
  });
  // ──────────────────────────────────────────────────────────────────────────
  return vendor;
};
/* ============================================================
   OTP LOGIN → ONLY APPROVED VENDORS
============================================================ */

// Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* STEP 1 → REQUEST OTP */
export const requestVendorLoginOtpService = async (email) => {
  const vendor = await Vendor.findOne({ email });

  if (!vendor) throw new Error("Vendor not found");

  // 🔐 BLOCK LOGIN IF NOT APPROVED
  if (vendor.status === "PENDING") {
    throw new Error("Your verification is under review");
  }

  if (vendor.status === "REJECTED") {
    throw new Error("Your vendor request was rejected");
  }

  if (vendor.status !== "APPROVED") {
    throw new Error("Vendor not approved");
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  vendor.emailOtp = otp;
  vendor.emailOtpExpiry = expiry;
  await vendor.save();

  await sendOtpEmail({
    to: email,
    otp,
    purpose: "LOGIN",
    role: "VENDOR",
  });
};

/* STEP 2 → VERIFY OTP */
export const verifyVendorLoginOtpService = async (email, otp) => {
  const vendor = await Vendor.findOne({ email });

  if (!vendor) throw new Error("Vendor not found");

  if (
    vendor.emailOtp !== otp ||
    vendor.emailOtpExpiry < new Date()
  ) {
    throw new Error("Invalid or expired OTP");
  }

  vendor.emailOtp = null;
  vendor.emailOtpExpiry = null;
  await vendor.save();

  // ✅ Vendor JWT (NOT user JWT)
  const token = jwt.sign(
    { vendorId: vendor._id, role: "VENDOR" },
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

/* ============================================================
   PROFILE
============================================================ */
export const getVendorProfileService = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId).select(
    "-emailOtp -emailOtpExpiry"
  );

  if (!vendor) throw new Error("Vendor not found");

  return vendor;
};

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

/* ============================================================
   ADD PRODUCT → ONLY APPROVED VENDORS
============================================================ */
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
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) throw new Error("Vendor not found");

  if (vendor.status !== "APPROVED") {
    throw new Error("Vendor not approved. Cannot add products.");
  }

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
};


export const getVendorWalletService = async (vendorId) => {

  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  const orders = await Order.find({
    "items.vendor": vendorId,
  }).populate("items.product");

  let total = 0;
  let paid = 0;
  let pending = 0;

  const transactions = [];

  for (const order of orders) {

    for (const item of order.items) {

      if (item.vendor.toString() !== vendorId.toString()) {
        continue;
      }

      const itemAmount =
        item.vendorAmount ||
        (item.price * item.quantity * 0.9);

      total += itemAmount;

      if (item.isSettled) {
        paid += itemAmount;
      } else {
        pending += itemAmount;
      }

      transactions.push({
        date:
          item.settledAt ||
          item.deliveredAt ||
          order.createdAt,

        productName:
          item.product?.name || "Product",

        quantity:
          item.quantity || 1,

        orderId:
          order._id,

        status:
          item.isSettled
            ? "PAID"
            : "PENDING",

        amount:
          itemAmount,
      });
    }
  }

  return {
    balance: vendor.wallet?.balance || 0,
    total,
    paid,
    pending,
    transactions,
  };
};