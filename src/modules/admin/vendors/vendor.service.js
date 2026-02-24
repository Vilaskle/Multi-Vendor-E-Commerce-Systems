import Vendor from "../../../models/Vendor.js";
import Product from "../../../models/Product.js";

// Get all vendors
export const getAllVendorsService = async (query) => {
  const { search, page = 1, limit = 10 } = query;

  const filter = search
    ? {
        businessName: { $regex: search, $options: "i" },
      }
    : {};

  return await Vendor.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

// Get vendor by ID
export const getVendorByIdService = async (id) => {
  return await Vendor.findById(id);
};

// Update vendor
export const updateVendorService = async (id, data) => {
  return await Vendor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Delete vendor
export const deleteVendorService = async (id) => {
  return await Vendor.findByIdAndDelete(id);
};

// Block / Unblock vendor
export const toggleVendorStatusService = async (id) => {
  const vendor = await Vendor.findById(id);

  if (!vendor) return null;

  vendor.isBlocked = !vendor.isBlocked;

  await vendor.save();

  return vendor;
};

//APPROVE/REJECT 
export const approveVendorService = async (id, status) => {
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid status. Use APPROVED or REJECTED");
  }

  const vendor = await Vendor.findById(id);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  // ✅ If already same status → don't throw error
  if (vendor.status === status) {
    return { alreadyUpdated: true, vendor };
  }

  // ✅ Update status
  vendor.status = status;

  if (status === "APPROVED") {
    vendor.approvedAt = new Date();
    vendor.rejectionReason = null;
  }

  if (status === "REJECTED") {
    vendor.rejectionReason = "Rejected by Admin";
    vendor.approvedAt = null;
  }

  await vendor.save();

  return { alreadyUpdated: false, vendor };
};
