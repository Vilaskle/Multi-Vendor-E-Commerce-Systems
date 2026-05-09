import {
  registerVendorService,
  requestVendorLoginOtpService,
  verifyVendorLoginOtpService,
  getVendorProfileService,
  updateVendorProfileService,
  addProductService,
  getVendorWalletService,
} from "./vendor.service.js";

import Vendor from "../../models/Vendor.js";
/* ======================================================
   REGISTER VENDOR (PUBLIC – NO LOGIN REQUIRED)
====================================================== */
export const registerVendor = async (req, res) => {
  try {
    const { name, email, phoneNo, gstNumber } = req.body;

    if (!name || !email || !phoneNo || !gstNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Shop & Establishment License is required",
      });
    }

    const vendor = await registerVendorService({
      name,
      email,
      phoneNo,
      gstNumber,
      shopLicenseFile: req.file,
    });

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully. Waiting for admin approval.",
      data: vendor,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
/* ======================================================
   2️⃣ REQUEST LOGIN OTP (ONLY APPROVED VENDORS)
====================================================== */
export const requestVendorLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    await requestVendorLoginOtpService(email);

    res.json({
      success: true,
      message: "OTP sent to vendor email",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   3️⃣ VERIFY OTP & LOGIN
====================================================== */
export const verifyVendorLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await verifyVendorLoginOtpService(email, otp);

    res.json({
      success: true,
      message: "Vendor login successful",
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   4️⃣ GET VENDOR PROFILE (LOGIN REQUIRED)
====================================================== */
export const getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const vendor = await getVendorProfileService(vendorId);

    res.json({
      success: true,
      data: vendor,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   5️⃣ UPDATE VENDOR PROFILE
====================================================== */
export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const { name, phoneNo } = req.body;

    const vendor = await updateVendorProfileService(vendorId, {
      name,
      phoneNo,
    });

    res.json({
      success: true,
      message: "Vendor profile updated successfully",
      data: vendor,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
/* ======================================================
   6️⃣ ADD PRODUCT (ONLY APPROVED VENDORS)
====================================================== */
export const addProduct = async (req, res) => {
  try {
    // ✅ Vendor must be logged in to add product
    const vendorId = req.user.vendorId;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ✅ Only admin-approved vendors can sell
    if (vendor.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved yet",
      });
    }

    const {
      name,
      category,
      productType,
      price,
      quantity,
      sizes,
      colors,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product images are required",
      });
    }

    const product = await addProductService({
      name,
      category,
      productType,
      price: Number(price),
      quantity: Number(quantity),
      sizes: Array.isArray(sizes) ? sizes : sizes.split(","),
      colors: Array.isArray(colors) ? colors : colors.split(","),
      vendorId,
      files: req.files,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// new

export const addBankDetails = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const { accountHolderName, accountNumber, ifsc } = req.body;

    if (!accountHolderName || !accountNumber || !ifsc) {
      return res.status(400).json({
        message: "All bank fields required",
      });
    }

    const vendor = await Vendor.findById(vendorId);

    vendor.bankDetails = {
      accountHolderName,
      accountNumber,
      ifsc,
    };

    await vendor.save();

    res.json({
      success: true,
      message: "Bank details added successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createFundAccount = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor.bankDetails) {
      return res.status(400).json({
        message: "Add bank details first",
      });
    }

    // 🔥 MOCK (no Razorpay)
    vendor.razorpayContactId = "cont_test_" + Date.now();
    vendor.fundAccountId = "fa_test_" + Date.now();

    await vendor.save();

    res.json({
      success: true,
      message: "Payout setup completed (mock)",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getVendorWallet = async (req, res) => {
  try {

    const vendorId = req.user.vendorId;

    const data = await getVendorWalletService(vendorId);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};