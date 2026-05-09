// import Order from "../../../models/Order.js";

// // Get all orders
// export const getAllOrdersService = async () => {
//   return await Order.find()
//     .populate("user", "name email")
//     .populate("orderItems.product", "name price")
//     .sort({ createdAt: -1 });
// };

// // Get order by ID
// export const getOrderByIdService = async (id) => {
//   return await Order.findById(id)
//     .populate("user", "name email")
//     .populate("orderItems.product", "name price");
// };

// // Update order status
// export const updateOrderStatusService = async (id, status) => {
//   const order = await Order.findById(id);
//   if (!order) return null;

//   order.orderStatus = status;
//   return await order.save();
// };

// // Update payment status
// export const updatePaymentStatusService = async (id, paymentStatus) => {
//   const order = await Order.findById(id);
//   if (!order) return null;

//   order.paymentStatus = paymentStatus;
//   return await order.save();
// };

// // Mark as delivered
// export const markOrderDeliveredService = async (id) => {
//   const order = await Order.findById(id);
//   if (!order) return null;

//   order.isDelivered = true;
//   order.deliveredAt = new Date();
//   order.orderStatus = "DELIVERED";

//   return await order.save();
// };

// // Delete order (optional)
// export const deleteOrderService = async (id) => {
//   return await Order.findByIdAndDelete(id);
// };



import Order from "../../../models/Order.js";
import OrderGroup from "../../../models/OrderGroup.js";
import { createNotification } from "../notifications/notification.service.js";
//import { checkAndCreatePayoutService } from "../vendorPayout/vendorPayout.service.js";
import Payment from"../../../models/Payment.js"
import razorpay from "../../../config/razorpay.js";
/**
 * Get all orders
 */
export const getAllOrdersService = async () => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name price")
    .populate("items.vendor", "businessName")
    .sort({ createdAt: -1 });

  return orders;
};


/**
 * Get single order
 */
export const getOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .populate("items.product", "name price")
    .populate("items.vendor", "businessName");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};


/**
 * Update order status
 */
// export const updateOrderStatusService = async (orderId, status) => {
//   const allowedStatus = [
//     "PLACED",
//     "PROCESSING",
//     "SHIPPED",
//     "DELIVERED",
//     "CANCELLED",
//   ];

//   if (!allowedStatus.includes(status)) {
//     throw new Error("Invalid order status");
//   }

//   const order = await Order.findByIdAndUpdate(
//     orderId,
//     { orderStatus: status },
//     { new: true }
//   );

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   return order;

// };

/**
 * Update payment status
 */
export const updatePaymentStatusService = async (orderId, status) => {
  const allowedStatus = ["PENDING", "PAID", "FAILED"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid payment status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: status },
    { new: true }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};


/**
 * Mark order delivered
 */
export const markOrderDeliveredService = async (orderId) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: "DELIVERED" },
    { new: true }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};


/**
 * Delete order
 */
export const deleteOrderService = async (orderId) => {
  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};



export const updateOrderStatusService = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  const statusMessages = {
    PROCESSING: "Seller has processed your order",
    SHIPPED: "Your item has been shipped",
    OUT_FOR_DELIVERY: "Your item is out for delivery",
    DELIVERED: "Your item has been delivered",
    CANCELLED: "Your order has been cancelled",
  };

  if (!status) throw new Error("Status is required");

  // 🔥 FIXED duplicate check
  const lastValidStatus = [...order.trackingHistory]
    .reverse()
    .find(step => step.status)?.status;

  if (lastValidStatus === status) {
    throw new Error("Status already updated");
  }

  order.orderStatus = status;

  order.trackingHistory.push({
    status,
    message: statusMessages[status] || status,
  });

  await order.save();

  return order;
};




/**
 * Admin wallet
 */
export const getAdminWalletService = async () => {
  const orders = await Order.find({ paymentStatus: "PAID" }).populate(
    "items.vendor",
    "name"
  );

  const vendorMap = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!item.vendor) return;

      const vendorId = item.vendor._id.toString();
      const total = item.price * item.quantity;
      const adminCommission = total * 0.1;
      const vendorAmount = total * 0.9;

      if (!vendorMap[vendorId]) {
        vendorMap[vendorId] = {
          vendorId,
          vendorName: item.vendor.name,
          totalProducts: 0,
          totalSales: 0,
          adminCommission: 0,
          vendorEarnings: 0,
        };
      }

      vendorMap[vendorId].totalProducts += item.quantity;
      vendorMap[vendorId].totalSales += total;
      vendorMap[vendorId].adminCommission += adminCommission;
      vendorMap[vendorId].vendorEarnings += vendorAmount;
    });
  });

  return Object.values(vendorMap);
};


// ─────────────────────────────────────────────────────────────────────────────
// NEW: Order list for AdminOrders.jsx
// Returns all orders. Each order gets orderStatus = "DELIVERED" only when
// every item inside it is DELIVERED, otherwise "PENDING".
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrdersListService = async () => {
  const orders = await Order.find()
    .populate("user", "name email phone")
    .populate("items.product", "name images price")
    .populate("items.vendor", "name")
    .sort({ createdAt: -1 });

  return orders.map((order) => {
    const allDelivered =
      order.items.length > 0 &&
      order.items.every((item) => item.status === "DELIVERED");

    return {
      _id: order._id,
      orderId: order._id.toString().slice(-8).toUpperCase(),
      user: order.user,
      vendor: order.vendor,
      totalAmount: order.totalAmount,
      itemsTotal: order.itemsTotal,
      deliveryCharge: order.deliveryCharge,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      orderStatus: allDelivered ? "DELIVERED" : "PENDING",
      itemCount: order.items.length,
      address: order.address,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });
};


// ─────────────────────────────────────────────────────────────────────────────
// NEW: Full order detail for AdminOrderDetail.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrderDetailService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "name email phone")
    .populate("items.product", "name images price category")
    .populate("items.vendor", "name");

  if (!order) throw new Error("Order not found");

  return order;
};


// ─────────────────────────────────────────────────────────────────────────────
// NEW: Update a single item's status inside an order
// ─────────────────────────────────────────────────────────────────────────────
export const updateItemStatusService = async (orderId, itemId, status) => {
  const validStatuses = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURN_APPROVED",
    "RETURN_COMPLETED",
    "RETURN_REJECTED",
    "REFUNDED",
    "EXCHANGE_REQUESTED",
  
    "EXCHANGE_SHIPPED",
  ];

  if (!validStatuses.includes(status)) throw new Error("Invalid status value");

  // Build the $set payload
  const setFields = { "items.$[elem].status": status };
  if (status === "DELIVERED") {
    setFields["items.$[elem].deliveredAt"] = new Date();
  }

  // Use raw MongoDB driver to bypass all Mongoose middleware
  const mongoose = await import("mongoose");
  const { ObjectId } = mongoose.default.Types;
  const collection = mongoose.default.connection.collection("orders");

  // Build raw update object
  const rawSet = { "items.$[elem].status": status };
  if (status === "DELIVERED") {
    rawSet["items.$[elem].deliveredAt"] = new Date();
  }

  console.log("RAW orderId:", orderId, "type:", typeof orderId);
  console.log("RAW itemId:", itemId, "type:", typeof itemId);
  console.log("RAW set:", rawSet);

  const updateResult = await collection.updateOne(
    { _id: new ObjectId(String(orderId)) },
    { $set: rawSet },
    { arrayFilters: [{ "elem._id": new ObjectId(String(itemId)) }] }
  );

  console.log("updateResult:", JSON.stringify(updateResult));

  if (updateResult.matchedCount === 0) throw new Error("Order not found in DB");
  if (updateResult.modifiedCount === 0) throw new Error("Item not found or status unchanged");

  // Re-fetch fresh from DB
  const updated = await Order.findById(orderId).lean();

  if (!updated) throw new Error("Order not found after update");

  const updatedItem = updated.items.find(
    (i) => i._id.toString() === String(itemId)
  );

  console.log("updatedItem after fetch:", updatedItem);

  if (!updatedItem) throw new Error("Item not found in order after update");

  const allDelivered = updated.items.every((i) => i.status === "DELIVERED");

  // Auto-create vendor payout when all items are delivered
  if (allDelivered) {
    try {
      await checkAndCreatePayoutService(orderId);
    } catch (err) {
      console.error("Payout creation error (non-blocking):", err.message);
    }
  }

  return {
    allDelivered,
    item: {
      _id: updatedItem._id,
      status: updatedItem.status,
      deliveredAt: updatedItem.deliveredAt || null,
    },
  };
};


// ─────────────────────────────────────────────────────────────────────────────
// ADD THESE to the bottom of your existing order.service.js
// (keep everything you already have — just append these new exports)
// ─────────────────────────────────────────────────────────────────────────────

//import OrderGroup from "../../../models/OrderGroup.js"; // adjust path if needed
// Order import already exists in your file — no need to add it again

// ─────────────────────────────────────────────────────────────────────────────
// 1.  GET /admin/orders/groups/all
//     Used by AdminOrders.jsx — shows one card per OrderGroup.
//     Each group gets a computed `groupStatus`:
//       "DELIVERED"  → every item in every child order is DELIVERED
//       "PENDING"    → anything else
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrderGroupsListService = async () => {
  const groups = await OrderGroup.find()
    .populate("user", "name email phone")
    // .populate({
    //   path: "orders",
    //   populate: [
    //     { path: "items.product", select: "name images price" },
    //     { path: "items.vendor",  select: "name email" },
    //   ],
    // })
    .populate({
      path: "orders",
      populate: [
        { path: "items.product", select: "name images price" },
        { path: "vendor", select: "name email" },
      ],
    })
    .sort({ createdAt: -1 });

  return groups.map((group) => {
    // Flatten every item across all child orders
    const allItems = group.orders.flatMap((o) => o.items || []);
    const totalItems = allItems.length;

    const groupStatus =
      totalItems > 0 && allItems.every((i) => i.status === "DELIVERED")
        ? "DELIVERED"
        : "PENDING";

    return {
      _id: group._id,
      groupId: group._id.toString().slice(-8).toUpperCase(),
      user: group.user,
      totalAmount: group.totalAmount,
      deliveryCharge: group.deliveryCharge,
      paymentStatus: group.paymentStatus,
      razorpayOrderId: group.razorpayOrderId,
      orderCount: group.orders.length,
      totalItems,
      groupStatus,   // ← what AdminOrders.jsx filters on (g.groupStatus)
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  });
};


// ─────────────────────────────────────────────────────────────────────────────
// 2.  GET /admin/orders/groups/:groupId
//     Used by AdminOrderGroupDetail.jsx — shows all vendor-order cards.
//     Each child Order gets a `computedStatus` that the frontend reads:
//       "DELIVERED"  → all items inside that order are DELIVERED
//       "PENDING"    → otherwise (you can extend to SHIPPED/PLACED etc.)
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrderGroupDetailService = async (groupId) => {
  const group = await OrderGroup.findById(groupId)
    .populate("user", "name email phone")
    .populate({
      path: "orders",
      populate: [
        // { path: "vendor",        select: "name email" },
        { path: "items.product", select: "name images price" },
        { path: "items.vendor", select: "name email" },
      ],
    });

  if (!group) throw new Error("Order group not found");

  // Attach computedStatus to every child order so the frontend can use it
  const ordersWithStatus = group.orders.map((order) => {
    const items = order.items || [];
    const allDone = items.length > 0 && items.every((i) => i.status === "DELIVERED");
    const anyShipped = items.some((i) => i.status === "SHIPPED");

    let computedStatus = "PENDING";
    if (allDone) computedStatus = "DELIVERED";
    else if (anyShipped) computedStatus = "SHIPPED";
    // Add more logic here if you want PLACED / CANCELLED etc.

    return {
      ...order.toObject(),
      computedStatus,
    };
  });

  return {
    _id: group._id,
    groupId: group._id.toString().slice(-8).toUpperCase(),
    user: group.user,
    totalAmount: group.totalAmount,
    deliveryCharge: group.deliveryCharge,
    paymentStatus: group.paymentStatus,
    razorpayOrderId: group.razorpayOrderId,
    orders: ordersWithStatus,    // ← array of vendor orders, each with computedStatus
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
};


export const approveReturnService = async ({ orderId, itemId }) => {

  // 1️⃣ Find Order
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // 2️⃣ Find Item
  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  // 3️⃣ Validation
  if (item.status !== "RETURN_REQUESTED") {
    throw new Error("Return not requested or already processed");
  }

  // ✅ ONLY APPROVE (NO REFUND HERE)
  item.status = "RETURN_APPROVED";
  item.returnApprovedAt = new Date();

  await order.save();

  await order.populate("items.product");

try {
  const user = await User.findById(order.user);

  if (user) {
    await sendOrderEmail({
      to: user.email,
      name: user.name || "User",
      type: "RETURN_APPROVED",
      orderId: order._id.toString().slice(-6),
      productName: item.product?.name,
      quantity: item.quantity,
    });
  }
} catch (err) {
  console.error("Approve Email Error:", err);
}

  return {
    orderId: order._id,
    itemId: item._id,
    message: "Return approved successfully",
  };
};

export const rejectReturnService = async ({
  orderId,
  itemId,
  reason
}) => {

  // 1️⃣ Find Order
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // 2️⃣ Find Item
  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  // 3️⃣ Validation
  if (item.status !== "RETURN_REQUESTED") {
    throw new Error("Return not requested or already processed");
  }

  // ❌ REJECT
  item.status = "RETURN_REJECTED";
  item.returnRejectedAt = new Date();
  item.returnRejectReason = reason || "Not specified";

  await order.save();

  // ✅ Populate product for email
  await order.populate("items.product");

  // 📩 Send Email
  try {
    const user = await User.findById(order.user);

    if (user) {
      await sendOrderEmail({
        to: user.email,
        name: user.name || "User",
        type: "RETURN_REJECTED",
        orderId: order._id.toString().slice(-6),
        productName: item.product?.name,
        quantity: item.quantity,
        reason: item.returnRejectReason
      });
    }
  } catch (err) {
    console.error("Reject Email Error:", err);
  }

  return {
    orderId: order._id,
    itemId: item._id,
    status: item.status,
  };
};

export const refundReturnService = async ({ orderId, itemId }) => {

  // 1️⃣ Find Order
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // 2️⃣ Find Item
  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  // 3️⃣ VALIDATION (IMPORTANT)
  if (item.status !== "RETURN_APPROVED") {
    throw new Error("Return must be approved before refund");
  }

  // 4️⃣ Calculate refund
  const refundAmount = item.price * item.quantity;

  let refundSuccess = false;
  let refundId = null;

  /* ================= ONLINE PAYMENT ================= */
  if (order.paymentMethod === "ONLINE") {

    const payment = await Payment.findOne({
      orders: order._id,
      status: "SUCCESS",
    });

    if (!payment || !payment.razorpayPaymentId) {
      throw new Error("Payment not found for refund");
    }

    try {
      const refund = await razorpay.payments.refund(
        payment.razorpayPaymentId,
        {
          amount: refundAmount * 100,
          speed: "optimum",
        }
      );

      refundSuccess = true;
      refundId = refund.id;

    }
    //catch (error) {
    //   console.error("Razorpay Refund Error:", error);
    //   throw new Error("Refund failed from Razorpay");
    // }
    catch (error) {

  console.error(
    "Razorpay Refund Error FULL:",
    error?.response?.data || error
  );

  throw new Error(
    error?.response?.data?.error?.description ||
    "Refund failed from Razorpay"
  );
}
  }

  /* ================= COD ================= */
  else if (order.paymentMethod === "COD") {

    if (!item.refundDetails) {
      throw new Error("Refund details missing for COD");
    }

    refundSuccess = true;
    refundId = "COD_REFUND_" + Date.now();
  }

  /* ================= UPDATE ITEM ================= */
  item.status = "RETURN_COMPLETED";
  item.refundStatus = "COMPLETED";
  item.refundAmount = refundAmount;
  item.refundId = refundId;
  item.returnCompletedAt = new Date();

  await order.save();
  await Product.findByIdAndUpdate(item.product, {
  $inc: { stock: item.quantity }
});

  /* ================= ADMIN WALLET ================= */
  const admin = await Admin.findOne({ role: "ADMIN" });

  await Transaction.create({
    actorType: "ADMIN",
    actorId: admin._id,
    type: "DEBIT",
    amount: refundAmount,
    source: "REFUND",
    referenceId: order._id,
  });

  await Admin.findByIdAndUpdate(admin._id, {
    $inc: { "wallet.balance": -refundAmount },
  });

  /* ================= EMAIL ================= */
  await order.populate("items.product");

  try {
    const user = await User.findById(order.user);

    console.log("📩 Sending refund email...");

    if (user) {
      console.log("User:", user?.email);
console.log("Email Type:", "RETURN_COMPLETED");
      await sendOrderEmail({
        to: user.email,
        name: user.name || "User",
        type: "RETURN_COMPLETED",
        orderId: order._id.toString().slice(-6),
       
        amount: refundAmount,
         productName: item.product?.name,
        refundId,
        paymentMethod: order.paymentMethod // 🔥 IMPORTANT
      });
    }
  } catch (err) {
  console.error("❌ Refund Email Error:", err.message);
  console.error(err);
}

  return {
    orderId: order._id,
    itemId: item._id,
    refundAmount,
    refundId,
    refundSuccess,
  };
};

export const shipExchangeService = async ({ orderId, itemId }) => {

  // 1️⃣ Find order
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // 2️⃣ Find item
  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  // 3️⃣ Validation
  if (item.status !== "EXCHANGE_REQUESTED") {
    throw new Error("Exchange not requested or already processed");
  }

  // ✅ Update status
  item.status = "EXCHANGE_SHIPPED";
  item.exchangeShippedAt = new Date();

  await order.save();

  // ✅ Populate product
  await order.populate("items.product");

  // 📩 Send email
  try {
    const user = await User.findById(order.user);

    if (user) {
      await sendOrderEmail({
        to: user.email,
        name: user.name || "User",
        type: "EXCHANGE_SHIPPED",
        orderId: order._id.toString().slice(-6),
        productName: item.product?.name,
        newSize: item.exchangeRequest?.newSize,
        newColor: item.exchangeRequest?.newColor
      });
    }

  } catch (err) {
    console.error("Exchange Email Error:", err);
  }

  return {
    orderId: order._id,
    itemId: item._id,
    status: item.status,
  };
};

// import Order from "../../../models/Order.js";
// import { calculateCommission } from "../../../utils/commissionCalculator.js";

// /* ============================================================
//    CREATE ORDER (MAIN LOGIC)
// ============================================================ */
// export const createOrderService = async (data = {}) => {
//   const {
//     user,
//     items,
//     discount = 0,
//     isPlatformDiscount = false,
//   } = data; // ✅ FIX HERE{
  
//   // 1️⃣ Calculate total
//   const totalAmount = items.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   // 2️⃣ Final amount after discount
//   const finalAmount = totalAmount - discount;

//   // 3️⃣ Group items by vendor
//   const vendorMap = {};

//   items.forEach((item) => {
//     const vendorId = item.vendor.toString();
//     const itemTotal = item.price * item.quantity;

//     if (!vendorMap[vendorId]) {
//       vendorMap[vendorId] = {
//         total: 0,
//         category: item.category || "default",
//       };
//     }

//     vendorMap[vendorId].total += itemTotal;
//   });

//   let totalAdminAmount = 0;
//   let totalVendorAmount = 0;
//   const vendorBreakdown = [];

//   // ============================================================
//   // 🟢 CASE 1: NORMAL DISCOUNT (shared)
//   // ============================================================
//   if (!isPlatformDiscount) {
//     for (const vendorId in vendorMap) {
//       const vendorTotal = vendorMap[vendorId].total;

//       const vendorShare = vendorTotal / totalAmount;
//       const vendorFinalAmount = finalAmount * vendorShare;

//       const {
//         adminAmount,
//         vendorAmount,
//         commissionPercent,
//       } = calculateCommission({
//         amount: vendorFinalAmount,
//         category: vendorMap[vendorId].category,
//       });

//       totalAdminAmount += adminAmount;
//       totalVendorAmount += vendorAmount;

//       vendorBreakdown.push({
//         vendor: vendorId,
//         totalAmount: vendorFinalAmount,
//         adminAmount,
//         vendorAmount,
//         commissionPercent,
//       });
//     }
//   }

//   // ============================================================
//   // 🔵 CASE 2: FESTIVAL DISCOUNT (admin bears loss)
//   // ============================================================
//   else {
//     for (const vendorId in vendorMap) {
//       const vendorTotal = vendorMap[vendorId].total;

//       const {
//         adminAmount,
//         vendorAmount,
//         commissionPercent,
//       } = calculateCommission({
//         amount: vendorTotal,
//         category: vendorMap[vendorId].category,
//       });

//       totalVendorAmount += vendorAmount;
//       totalAdminAmount += adminAmount;

//       vendorBreakdown.push({
//         vendor: vendorId,
//         totalAmount: vendorTotal,
//         adminAmount,
//         vendorAmount,
//         commissionPercent,
//       });
//     }

//     // Admin absorbs discount
//     totalAdminAmount -= discount;
//   }

//   // 4️⃣ Create Order
//   const order = await Order.create({
//     user,
//     items,

//     totalAmount,
//     discount,
//     finalAmount,

//     totalAdminAmount,
//     totalVendorAmount,

//     vendorBreakdown,

//     orderStatus: "PLACED",
//     paymentStatus: "PENDING",
//   });

//   return order;
// };

// /* ============================================================
//    UPDATE ORDER STATUS
// ============================================================ */
// export const updateOrderStatusService = async (orderId, status) => {
//   const allowedStatus = [
//     "PLACED",
//     "PROCESSING",
//     "SHIPPED",
//     "DELIVERED",
//     "CANCELLED",
//   ];

//   if (!allowedStatus.includes(status)) {
//     throw new Error("Invalid order status");
//   }

//   const order = await Order.findById(orderId);

//   if (!order) throw new Error("Order not found");

//   order.orderStatus = status;

//   // 🔄 Cancel logic
//   if (status === "CANCELLED") {
//     order.totalAdminAmount = 0;
//     order.totalVendorAmount = 0;

//     order.vendorBreakdown = order.vendorBreakdown.map((v) => ({
//       ...v,
//       adminAmount: 0,
//       vendorAmount: 0,
//     }));
//   }

//   await order.save();

//   return order;
// };

// /* ============================================================
//    OTHER SERVICES
// ============================================================ */

// export const getAllOrdersService = async () => {
//   return await Order.find()
//     .populate("user", "name email")
//     .populate("items.product", "name price")
//     .populate("items.vendor", "businessName")
//     .sort({ createdAt: -1 });
// };

// export const getOrderByIdService = async (orderId) => {
//   const order = await Order.findById(orderId)
//     .populate("user", "name email")
//     .populate("items.product", "name price")
//     .populate("items.vendor", "businessName");

//   if (!order) throw new Error("Order not found");

//   return order;
// };

// export const updatePaymentStatusService = async (orderId, status) => {
//   const order = await Order.findByIdAndUpdate(
//     orderId,
//     { paymentStatus: status },
//     { new: true }
//   );

//   if (!order) throw new Error("Order not found");

//   return order;
// };

// export const markOrderDeliveredService = async (orderId) => {
//   return await Order.findByIdAndUpdate(
//     orderId,
//     { orderStatus: "DELIVERED" },
//     { new: true }
//   );
// };

// export const deleteOrderService = async (orderId) => {
//   const order = await Order.findByIdAndDelete(orderId);

//   if (!order) throw new Error("Order not found");

//   return order;
// };