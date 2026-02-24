import {
  getAllVendorsService,
  getVendorByIdService,
  updateVendorService,
  deleteVendorService,
  toggleVendorStatusService,
  approveVendorService,
} from "./vendor.service.js";

// Get all vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await getAllVendorsService(req.query);

    res.status(200).json({
      success: true,
      data: vendors,
    });
  } 
  // catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     message: "Failed to fetch vendors",
  //   });
  // }
  catch (error) {
  console.error(error); // 👈 add this
  res.status(500).json({
    success: false,
    message: error.message,
  });
}

};

// Get vendor by ID
export const getVendorById = async (req, res) => {
  try {
    const vendor = await getVendorByIdService(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vendor",
    });
  }
};

// Update vendor
export const updateVendor = async (req, res) => {
  try {
    const vendor = await updateVendorService(req.params.id, req.body);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating vendor",
    });
  }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await deleteVendorService(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting vendor",
    });
  }
};

// Block / Unblock vendor
export const toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await toggleVendorStatusService(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor status updated",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating vendor status",
    });
  }
};


// APPRROVE/REJECT
export const approveVendor = async (req, res) => {
  try {
    const result = await approveVendorService(
      req.params.id,
      req.body.status
    );

    // ✅ If already approved/rejected
    if (result.alreadyUpdated) {
      return res.status(200).json({
        success: true,
        message: `Vendor already ${req.body.status.toLowerCase()}`,
        data: result.vendor,
      });
    }

    // ✅ Fresh approval/rejection
    res.status(200).json({
      success: true,
      message: `Vendor ${req.body.status.toLowerCase()} successfully`,
      data: result.vendor,
    });

  } catch (error) {
    console.error("APPROVAL ERROR:", error.message);

    res.status(400).json({
      success: false,
      message: error.message, // return real reason
    });
  }
};
