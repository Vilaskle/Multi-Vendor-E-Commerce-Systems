import { registerVendorService ,
  requestVendorLoginOtpService,
  verifyVendorLoginOtpService,
getVendorProfileService,
  updateVendorProfileService,
addProductService  } from "./vendor.service.js";

export const registerVendor = async (req, res) => {
  try {
    const { name, email, phoneNo } = req.body;

    const vendor = await registerVendorService({
      name,
      email,
      phoneNo,
    });

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully. Awaiting admin approval.",
      data: vendor,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


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

// GET VENDOR PROFILE
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

// UPDATE VENDOR PROFILE
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


export const addProduct = async (req, res) => {
  try {

    console.log("=== ADD PRODUCT DEBUG ===");
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);
    console.log("FILES:", req.files);

    const vendorId = req.user.vendorId;

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
        message: "At least one product image is required",
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
  } catch (error) {
  console.error("ADD PRODUCT FAILED:", error);

  res.status(500).json({
    success: false,
    message: error.message || "Add product failed",
  });
}
};