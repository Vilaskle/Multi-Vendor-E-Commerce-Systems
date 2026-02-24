
// import {
//   getAllVendorsService,
//   approveVendorService,
//   rejectVendorService,
//   getPendingVendorsService,
// } from "./admin.service.js";
// import { adminLoginService } from "./admin.service.js";
// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const result = await adminLoginService(email, password);

//     return res.json({
//       success: true,
//       message: "Admin login successful",
//       data: result,
//     });
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// //Get all Pending vendors
// export const getPendingVendors = async (req, res) => {
//   try {
//     const vendors = await getPendingVendorsService();

//     res.json({
//       success: true,
//       data: vendors,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// // Get all vendors
// export const getAllVendors = async (req, res) => {
//   try {
//     const vendors = await getAllVendorsService();

//     res.json({
//       success: true,
//       data: vendors,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// // Approve vendor
// export const approveVendor = async (req, res) => {
//   try {
//     const { vendorId } = req.params;

//     const vendor = await approveVendorService(vendorId);

//     res.json({
//       success: true,
//       message: "Vendor approved successfully",
//       data: vendor,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// // Reject vendor
// export const rejectVendor = async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     const { reason } = req.body;

//     const vendor = await rejectVendorService(vendorId, reason);

//     res.json({
//       success: true,
//       message: "Vendor rejected",
//       data: vendor,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// import {
//   getAllVendorsService,
//   approveVendorService,
//   rejectVendorService,
//   getPendingVendorsService,
//   adminLoginService,
// } from "./admin.service.js";

// // ================= ADMIN LOGIN =================
// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await adminLoginService(email, password);

//     res.json({
//       success: true,
//       message: "Admin login successful",
//       data: result,
//     });
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================= GET PENDING VENDORS =================
// export const getPendingVendors = async (req, res) => {
//   try {
//     const vendors = await getPendingVendorsService();

//     res.json({  data: vendors });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // ================= GET ALL VENDORS =================
// export const getAllVendors = async (req, res) => {
//   try {
//     const vendors = await getAllVendorsService();

//     res.json({ success: true, data: vendors });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // ================= APPROVE VENDOR =================
// export const approveVendor = async (req, res) => {
//   try {
//     const { vendorId } = req.params;

//     const vendor = await approveVendorService(vendorId);

//     res.json({
//       success: true,
//       message: "Vendor approved successfully",
//       data: vendor,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // ================= REJECT VENDOR =================
// export const rejectVendor = async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     const { reason } = req.body;

//     const vendor = await rejectVendorService(vendorId, reason);

//     res.json({
//       success: true,
//       message: "Vendor rejected",
//       data: vendor,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// import {
//   getAllVendorsService,
//   approveVendorService,
//   rejectVendorService,
// } from "./admin.service.js";
import { adminLoginService } from "./admin.service.js";
// import { getAllUsersByAdminService } from "./admin.service.js";
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