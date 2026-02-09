
import {
  getAllVendorsService,
  approveVendorService,
  rejectVendorService,
} from "./admin.service.js";
import { adminLoginService } from "./admin.service.js";
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await adminLoginService(email, password);

    return res.json({
      success: true,
      message: "Admin login successful",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await getAllVendorsService();

    res.json({
      success: true,
      data: vendors,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Approve vendor
export const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await approveVendorService(vendorId);

    res.json({
      success: true,
      message: "Vendor approved successfully",
      data: vendor,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Reject vendor
export const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await rejectVendorService(vendorId);

    res.json({
      success: true,
      message: "Vendor rejected",
      data: vendor,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
