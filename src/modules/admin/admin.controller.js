
// // import {
// //   getAllVendorsService,
// //   approveVendorService,
// //   rejectVendorService,
// //   getPendingVendorsService,
// // } from "./admin.service.js";
// // import { adminLoginService } from "./admin.service.js";
// // export const adminLogin = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Email and password are required",
// //       });
// //     }

// //     const result = await adminLoginService(email, password);

// //     return res.json({
// //       success: true,
// //       message: "Admin login successful",
// //       data: result,
// //     });
// //   } catch (error) {
// //     return res.status(401).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // //Get all Pending vendors
// // export const getPendingVendors = async (req, res) => {
// //   try {
// //     const vendors = await getPendingVendorsService();

// //     res.json({
// //       success: true,
// //       data: vendors,
// //     });
// //   } catch (err) {
// //     res.status(400).json({
// //       success: false,
// //       message: err.message,
// //     });
// //   }
// // };
// // // Get all vendors
// // export const getAllVendors = async (req, res) => {
// //   try {
// //     const vendors = await getAllVendorsService();

// //     res.json({
// //       success: true,
// //       data: vendors,
// //     });
// //   } catch (err) {
// //     res.status(400).json({
// //       success: false,
// //       message: err.message,
// //     });
// //   }
// // };

// // // Approve vendor
// // export const approveVendor = async (req, res) => {
// //   try {
// //     const { vendorId } = req.params;

// //     const vendor = await approveVendorService(vendorId);

// //     res.json({
// //       success: true,
// //       message: "Vendor approved successfully",
// //       data: vendor,
// //     });
// //   } catch (err) {
// //     res.status(400).json({
// //       success: false,
// //       message: err.message,
// //     });
// //   }
// // };

// // // Reject vendor
// // export const rejectVendor = async (req, res) => {
// //   try {
// //     const { vendorId } = req.params;
// //     const { reason } = req.body;

// //     const vendor = await rejectVendorService(vendorId, reason);

// //     res.json({
// //       success: true,
// //       message: "Vendor rejected",
// //       data: vendor,
// //     });
// //   } catch (err) {
// //     res.status(400).json({ success: false, message: err.message });
// //   }
// // };

// // import {
// //   getAllVendorsService,
// //   approveVendorService,
// //   rejectVendorService,
// //   getPendingVendorsService,
// //   adminLoginService,
// // } from "./admin.service.js";

// // // ================= ADMIN LOGIN =================
// // export const adminLogin = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const result = await adminLoginService(email, password);

// //     res.json({
// //       success: true,
// //       message: "Admin login successful",
// //       data: result,
// //     });
// //   } catch (error) {
// //     res.status(401).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================= GET PENDING VENDORS =================
// // export const getPendingVendors = async (req, res) => {
// //   try {
// //     const vendors = await getPendingVendorsService();

// //     res.json({  data: vendors });
// //   } catch (err) {
// //     res.status(400).json({ success: false, message: err.message });
// //   }
// // };

// // // ================= GET ALL VENDORS =================
// // export const getAllVendors = async (req, res) => {
// //   try {
// //     const vendors = await getAllVendorsService();

// //     res.json({ success: true, data: vendors });
// //   } catch (err) {
// //     res.status(400).json({ success: false, message: err.message });
// //   }
// // };

// // // ================= APPROVE VENDOR =================
// // export const approveVendor = async (req, res) => {
// //   try {
// //     const { vendorId } = req.params;

// //     const vendor = await approveVendorService(vendorId);

// //     res.json({
// //       success: true,
// //       message: "Vendor approved successfully",
// //       data: vendor,
// //     });
// //   } catch (err) {
// //     res.status(400).json({ success: false, message: err.message });
// //   }
// // };

// // // ================= REJECT VENDOR =================
// // export const rejectVendor = async (req, res) => {
// //   try {
// //     const { vendorId } = req.params;
// //     const { reason } = req.body;

// //     const vendor = await rejectVendorService(vendorId, reason);

// //     res.json({
// //       success: true,
// //       message: "Vendor rejected",
// //       data: vendor,
// //     });
// //   } catch (err) {
// //     res.status(400).json({ success: false, message: err.message });
// //   }
// // };

// // import {
// //   getAllVendorsService,
// //   approveVendorService,
// //   rejectVendorService,
// // } from "./admin.service.js";


// import { adminLoginService } from "./admin.service.js";
// // import { getAllUsersByAdminService } from "./admin.service.js";
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


// import { adminLoginService,
//    getDashboardCountsService,
//   getTotalOrders,
//   getTotalRevenue,
//   getTopVendor,
//   getTopCustomer,
//   getTopProducts,
//   getOrdersByDate } from "./admin.service.js";

// // ADMIN LOGIN
// export const adminLogin = async (req, res) => {
// try {
// const { email, password } = req.body;


// if (!email || !password) {
//   return res.status(400).json({
//     success: false,
//     message: "Email and password are required",
//   });
// }

// const result = await adminLoginService(email, password);

// return res.json({
//   success: true,
//   message: "Admin login successful",
//   data: result,
// });


// } catch (error) {
// return res.status(401).json({
// success: false,
// message: error.message,
// });
// }
// };

// // DASHBOARD COUNTS (for sidebar badges)
// export const getDashboardCounts = async (req, res) => {
// try {
// const counts = await getDashboardCountsService();


// return res.status(200).json({
//   success: true,
//   data: counts
// });


// } catch (error) {
// return res.status(500).json({
// success: false,
// message: "Failed to fetch dashboard counts",
// error: error.message
// });
// }
// };

// export const getDashboardData = async (req, res) => {
//   try {
//     const [
//       totalOrders,
//       totalRevenue,
//       topVendor,
//       topCustomer,
//       topProducts,
//       ordersByDate
//     ] = await Promise.all([
//       getTotalOrders(),
//       getTotalRevenue(),
//       getTopVendor(),
//       getTopCustomer(),
//       getTopProducts(),
//       getOrdersByDate()
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalOrders,
//         totalRevenue,
//         topVendor,
//         topCustomer,
//         topProducts,
//         ordersByDate
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

import {
  adminLoginService,
  getDashboardCountsService,
  getTotalOrders,
  getTotalRevenue,
  getTopVendor,
  getTopCustomer,
  getTopProducts,
  getOrdersByDate,
  getRevenueByDate,
  getOrdersByStatus,
  getUserGrowthByDate,
  getRevenueByMonth,
  getTopCategories,
  getTopVendorsByRevenue,
  getOrdersByDayOfWeek,
  getAdminWalletService,
} from "./admin.service.js";



import { approveReturnService,rejectReturnService,refundReturnService,shipExchangeService,settleVendor} from "./admin.service.js";


// ─── Admin Login ─────────────────────────────────────────────────────────────
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

    return res.status(200).json({
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

// ─── Dashboard Counts ─────────────────────────────────────────────────────────
export const getDashboardCounts = async (req, res) => {
  try {
    const counts = await getDashboardCountsService();

    return res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard counts",
      error: error.message,
    });
  }
};

// ─── Dashboard Analytics ──────────────────────────────────────────────────────
export const getDashboardData = async (req, res) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      topVendor,
      topCustomer,
      topProducts,
      ordersByDate,
    ] = await Promise.all([
      getTotalOrders(),
      getTotalRevenue(),
      getTopVendor(),
      getTopCustomer(),
      getTopProducts(),
      getOrdersByDate(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        topVendor,
        topCustomer,
        topProducts,
        ordersByDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

// ─── All Graph Data ───────────────────────────────────────────────────────────
export const getGraphData = async (req, res) => {
  try {
    const { days = 30, year = new Date().getFullYear() } = req.query;

    const [
      ordersByDate,
      revenueByDate,
      ordersByStatus,
      userGrowth,
      revenueByMonth,
      topCategories,
      topVendors,
      ordersByDayOfWeek,
    ] = await Promise.all([
      getOrdersByDate(Number(days)),
      getRevenueByDate(Number(days)),
      getOrdersByStatus(),
      getUserGrowthByDate(Number(days)),
      getRevenueByMonth(Number(year)),
      getTopCategories(),
      getTopVendorsByRevenue(),
      getOrdersByDayOfWeek(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        ordersByDate,       // Line chart  - orders trend
        revenueByDate,      // Area chart  - revenue trend
        ordersByStatus,     // Pie/Donut   - order statuses
        userGrowth,         // Area chart  - new users
        revenueByMonth,     // Bar chart   - monthly revenue
        topCategories,      // Bar/Pie     - category performance
        topVendors,         // Bar chart   - vendor leaderboard
        ordersByDayOfWeek,  // Bar chart   - busiest days
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch graph data",
      error: error.message,
    });
  }
};


export const getAdminWallet = async (req, res) => {
  try {

    const data = await getAdminWalletService();

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




export const approveReturn = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const data = await approveReturnService({ orderId, itemId });

    res.status(200).json({
      success: true,
      message: "Return approved & refunded",
      data,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const rejectReturn = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { reason } = req.body; // optional

    const data = await rejectReturnService({
      orderId,
      itemId,
      reason
    });

    res.status(200).json({
      success: true,
      message: "Return rejected successfully",
      data,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refundReturn = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const data = await refundReturnService({ orderId, itemId });

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const shipExchange = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const data = await shipExchangeService({ orderId, itemId });

    res.status(200).json({
      success: true,
      message: "Exchange item shipped successfully",
      data,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Vendor payout
export const settleVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const data = await settleVendor({ vendorId });

    res.status(200).json({
      success: true,
      message: "Vendor paid successfully",
      data,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};