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


// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import Admin from "../../models/Admin.js";



// export const adminLoginService = async (email, password) => {
//   // const admin = await Admin.findOne({ email }).select("+password");
// const admin = await Admin.findOne({ email }).select("+password");

//   if (!admin) {
//     throw new Error("Invalid email or password");
//   }

//   const isMatch = await bcrypt.compare(password, admin.password);

//   if (!isMatch) {
//     throw new Error("Invalid email or password");
//   }

//   const token = jwt.sign(
//     {
//       adminId: admin._id,
//       role: admin.role, // "ADMIN"
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   return {
//     token,
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//   };
// };



// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import Admin from "../../models/Admin.js";

// import User from "../../models/User.js";
// import Vendor from "../../models/Vendor.js";
// import Product from "../../models/Product.js";
// import Order from "../../models/Order.js";

// // ADMIN LOGIN SERVICE
// export const adminLoginService = async (email, password) => {

// const admin = await Admin.findOne({ email }).select("+password");

// if (!admin) {
// throw new Error("Invalid email or password");
// }

// const isMatch = await bcrypt.compare(password, admin.password);

// if (!isMatch) {
// throw new Error("Invalid email or password");
// }

// const token = jwt.sign(
// {
// adminId: admin._id,
// role: admin.role,
// },
// process.env.JWT_SECRET,
// { expiresIn: "1d" }
// );

// return {
// token,
// id: admin._id,
// name: admin.name,
// email: admin.email,
// };
// };


// // 1. TOTAL ORDERS
// export const getTotalOrders = async () => {
//   return await Order.countDocuments();
// };

// // 2. TOTAL REVENUE
// export const getTotalRevenue = async () => {
//   const result = await Order.aggregate([
//     {
//       $group: {
//         _id: null,
//         total: { $sum: "$totalAmount" }
//       }
//     }
//   ]);

//   return result[0]?.total || 0;
// };

// // 3. TOP VENDOR (highest sales)
// export const getTopVendor = async () => {
//   return await Order.aggregate([
//     { $unwind: "$items" },
//     {
//       $group: {
//         _id: "$items.vendor",
//         totalSales: { $sum: "$items.price" }
//       }
//     },
//     { $sort: { totalSales: -1 } },
//     { $limit: 1 }
//   ]);
// };

// // 4. TOP CUSTOMER
// export const getTopCustomer = async () => {
//   return await Order.aggregate([
//     {
//       $group: {
//         _id: "$user",
//         totalSpent: { $sum: "$totalAmount" }
//       }
//     },
//     { $sort: { totalSpent: -1 } },
//     { $limit: 1 }
//   ]);
// };

// // 5. MOST SOLD PRODUCTS
// export const getTopProducts = async () => {
//   return await Order.aggregate([
//     { $unwind: "$items" },
//     {
//       $group: {
//         _id: "$items.product",
//         totalSold: { $sum: "$items.quantity" }
//       }
//     },
//     { $sort: { totalSold: -1 } },
//     { $limit: 5 }
//   ]);
// };

// // 6. ORDERS PER DAY (for graph)
// export const getOrdersByDate = async () => {
//   return await Order.aggregate([
//     {
//       $group: {
//         _id: {
//           day: { $dayOfMonth: "$createdAt" },
//           month: { $month: "$createdAt" },
//           year: { $year: "$createdAt" }
//         },
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
//   ]);
// };

// // DASHBOARD COUNTS SERVICE
// export const getDashboardCountsService = async () => {
// const [users, vendors, products, orders] = await Promise.all([
// User.countDocuments(),
// Vendor.countDocuments(),
// Product.countDocuments(),
// Order.countDocuments(),
// ]);

// return {
// users,
// vendors,
// products,
// orders,
// };
// };



// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import Admin from "../../models/Admin.js";
// import User from "../../models/User.js";
// import Vendor from "../../models/Vendor.js";
// import Product from "../../models/Product.js";
// import Order from "../../models/Order.js";

// // ─── Admin Login ────────────────────────────────────────────────────────────
// export const adminLoginService = async (email, password) => {
//   const admin = await Admin.findOne({ email }).select("+password");

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

// // ─── Dashboard Counts ───────────────────────────────────────────────────────
// export const getDashboardCountsService = async () => {
//   const [users, vendors, products, orders] = await Promise.all([
//     User.countDocuments(),
//     Vendor.countDocuments(),
//     Product.countDocuments(),
//     Order.countDocuments(),
//   ]);

//   return { users, vendors, products, orders };
// };

// // ─── Total Orders ───────────────────────────────────────────────────────────
// export const getTotalOrders = async () => {
//   return await Order.countDocuments();
// };

// // ─── Total Revenue ──────────────────────────────────────────────────────────
// export const getTotalRevenue = async () => {
//   const result = await Order.aggregate([
//     { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//   ]);

//   return result[0]?.total ?? 0;
// };

// // ─── Top Vendor (by sales) ──────────────────────────────────────────────────
// export const getTopVendor = async () => {
//   const result = await Order.aggregate([
//     { $unwind: "$items" },
//     {
//       $group: {
//         _id: "$items.vendor",
//         totalSales: { $sum: "$items.price" },
//       },
//     },
//     { $sort: { totalSales: -1 } },
//     { $limit: 1 },
//     {
//       $lookup: {
//         from: "vendors",
//         localField: "_id",
//         foreignField: "_id",
//         as: "vendorDetails",
//       },
//     },
//     { $unwind: { path: "$vendorDetails", preserveNullAndEmptyArrays: true } },
//     {
//       $project: {
//         _id: 1,
//         totalSales: 1,
//         name: "$vendorDetails.name",
//         email: "$vendorDetails.email",
//       },
//     },
//   ]);

//   return result[0] ?? null;
// };

// // ─── Top Customer (by spend) ────────────────────────────────────────────────
// export const getTopCustomer = async () => {
//   const result = await Order.aggregate([
//     {
//       $group: {
//         _id: "$user",
//         totalSpent: { $sum: "$totalAmount" },
//       },
//     },
//     { $sort: { totalSpent: -1 } },
//     { $limit: 1 },
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id",
//         as: "userDetails",
//       },
//     },
//     { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
//     {
//       $project: {
//         _id: 1,
//         totalSpent: 1,
//         name: "$userDetails.name",
//         email: "$userDetails.email",
//       },
//     },
//   ]);

//   return result[0] ?? null;
// };

// // ─── Top Products (by quantity sold) ────────────────────────────────────────
// export const getTopProducts = async () => {
//   return await Order.aggregate([
//     { $unwind: "$items" },
//     {
//       $group: {
//         _id: "$items.product",
//         totalSold: { $sum: "$items.quantity" },
//       },
//     },
//     { $sort: { totalSold: -1 } },
//     { $limit: 5 },
//     {
//       $lookup: {
//         from: "products",
//         localField: "_id",
//         foreignField: "_id",
//         as: "productDetails",
//       },
//     },
//     { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
//     {
//       $project: {
//         _id: 1,
//         totalSold: 1,
//         name: "$productDetails.name",
//         image: "$productDetails.image",
//       },
//     },
//   ]);
// };

// // ─── Orders Per Day (for graph) ──────────────────────────────────────────────
// export const getOrdersByDate = async (days = 30) => {
//   const since = new Date();
//   since.setDate(since.getDate() - days);

//   return await Order.aggregate([
//     { $match: { createdAt: { $gte: since } } },
//     {
//       $group: {
//         _id: {
//           year: { $year: "$createdAt" },
//           month: { $month: "$createdAt" },
//           day: { $dayOfMonth: "$createdAt" },
//         },
//         count: { $sum: 1 },
//         revenue: { $sum: "$totalAmount" },
//       },
//     },
//     { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     {
//       $project: {
//         _id: 0,
//         date: {
//           $dateFromParts: {
//             year: "$_id.year",
//             month: "$_id.month",
//             day: "$_id.day",
//           },
//         },
//         count: 1,
//         revenue: 1,
//       },
//     },
//   ]);
// };

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";
import User from "../../models/User.js";
import Vendor from "../../models/Vendor.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import Transaction from "../../models/Transaction.js"

// ─── Admin Login ─────────────────────────────────────────────────────────────
export const adminLoginService = async (email, password) => {
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { adminId: admin._id, role: admin.role },
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

// ─── Dashboard Counts ─────────────────────────────────────────────────────────
export const getDashboardCountsService = async () => {
  const [users, vendors, products, orders] = await Promise.all([
    User.countDocuments(),
    Vendor.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  return { users, vendors, products, orders };
};

// ─── Total Orders ─────────────────────────────────────────────────────────────
export const getTotalOrders = async () => {
  return await Order.countDocuments();
};

// ─── Total Revenue ────────────────────────────────────────────────────────────
export const getTotalRevenue = async () => {
  const result = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  return result[0]?.total ?? 0;
};

// ─── Top Vendor (by sales) ────────────────────────────────────────────────────
export const getTopVendor = async () => {
  const result = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.vendor",
        totalSales: { $sum: "$items.price" },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "vendors",
        localField: "_id",
        foreignField: "_id",
        as: "vendorDetails",
      },
    },
    { $unwind: { path: "$vendorDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalSales: 1,
        name: "$vendorDetails.name",
        email: "$vendorDetails.email",
      },
    },
  ]);

  return result[0] ?? null;
};

// ─── Top Customer (by spend) ──────────────────────────────────────────────────
export const getTopCustomer = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$totalAmount" },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalSpent: 1,
        name: "$userDetails.name",
        email: "$userDetails.email",
      },
    },
  ]);

  return result[0] ?? null;
};

// ─── Top Products (by quantity sold) ──────────────────────────────────────────
export const getTopProducts = async () => {
  return await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalSold: 1,
        name: "$productDetails.name",
        image: "$productDetails.image",
      },
    },
  ]);
};

// ─── Orders Per Day (for line graph) ──────────────────────────────────────────
export const getOrdersByDate = async (days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        count: 1,
        revenue: 1,
      },
    },
  ]);
};

// ─── Revenue Per Day (for area graph) ─────────────────────────────────────────
export const getRevenueByDate = async (days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        revenue: 1,
        orderCount: 1,
      },
    },
  ]);
};

// ─── Orders By Status (for pie/donut chart) ────────────────────────────────────
export const getOrdersByStatus = async () => {
  return await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);
};

// ─── New Users Per Day (for user growth graph) ─────────────────────────────────
export const getUserGrowthByDate = async (days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return await User.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        newUsers: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        newUsers: 1,
      },
    },
  ]);
};

// ─── Revenue By Month (for yearly bar chart) ───────────────────────────────────
export const getRevenueByMonth = async (year = new Date().getFullYear()) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        revenue: 1,
        orderCount: 1,
      },
    },
  ]);
};

// ─── Top Categories By Sales (for bar/pie chart) ───────────────────────────────
export const getTopCategories = async () => {
  return await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$productDetails.category",
        totalSales: { $sum: "$items.price" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 6 },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalSales: 1,
        totalOrders: 1,
      },
    },
  ]);
};

// ─── Top Vendors By Revenue (for leaderboard bar chart) ───────────────────────
export const getTopVendorsByRevenue = async (limit = 5) => {
  return await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.vendor",
        totalRevenue: { $sum: "$items.price" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "vendors",
        localField: "_id",
        foreignField: "_id",
        as: "vendorDetails",
      },
    },
    { $unwind: { path: "$vendorDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalRevenue: 1,
        totalOrders: 1,
        name: "$vendorDetails.name",
      },
    },
  ]);
};

// ─── Orders By Day Of Week (for heatmap/bar chart) ────────────────────────────
export const getOrdersByDayOfWeek = async () => {
  return await Order.aggregate([
    {
      $group: {
        _id: { dayOfWeek: { $dayOfWeek: "$createdAt" } },
        count: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.dayOfWeek": 1 } },
    {
      $project: {
        _id: 0,
        // 1=Sunday, 2=Monday ... 7=Saturday
        day: {
          $arrayElemAt: [
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            { $subtract: ["$_id.dayOfWeek", 1] },
          ],
        },
        count: 1,
        revenue: 1,
      },
    },
  ]);
};


export const getAdminWalletService = async () => {

  const admin = await Admin.findOne({ role: "ADMIN" });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const transactions = await Transaction.find({
    actorType: "ADMIN",
    actorId: admin._id,
  })
    .sort({ createdAt: -1 });

  return {
    balance: admin.wallet?.balance || 0,
    transactions,
  };
};