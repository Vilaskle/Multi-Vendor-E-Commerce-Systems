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


import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";
import Vendor from "../../models/Vendor.js";
import Order from "../../models/Order.js";
import Payment from "../../models/Payment.js";
import Transaction from "../../models/Transaction.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import { sendOrderEmail } from "../../services/email/email.service.js";
import { razorpay } from "../../services/payment/payment.gateway.js";

export const adminLoginService = async (email, password) => {
  // const admin = await Admin.findOne({ email }).select("+password");
const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      adminId: admin._id,
      role: admin.role, // "ADMIN"
    },
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

    } catch (error) {
      console.error("Razorpay Refund Error:", error);
      throw new Error("Refund failed from Razorpay");
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

export const settleVendor = async ({ vendorId }) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    /* ============================================================
       1️⃣ FETCH ONLY ELIGIBLE ORDERS (CORRECT FILTER)
    ============================================================ */
    const orders = await Order.find({
      items: {
        $elemMatch: {
          vendor: vendorId,
          status: "DELIVERED",
          refundStatus: "NONE",
          isSettled: false
        }
      }
    }).session(session);

    /* ============================================================
       2️⃣ INITIALIZE VARIABLES
    ============================================================ */
    let totalPayout = 0;
    let totalCommission = 0;
    let totalVendorAmount = 0;
    let settledItemsCount = 0;

    /* ============================================================
       3️⃣ PROCESS ITEMS (ITEM-LEVEL LOGIC)
    ============================================================ */
    for (const order of orders) {

      let orderUpdated = false;

      for (const item of order.items) {

        if (
          item.vendor.toString() === vendorId &&
          item.status === "DELIVERED" &&
          item.refundStatus === "NONE" &&
          !item.isSettled
        ) {

          const amount = item.price * item.quantity;

          const commissionRate = 0.1; // 🔥 you can make dynamic later
          const itemCommission = amount * commissionRate;
          const itemVendorAmount = amount - itemCommission;

          // accumulate
          totalPayout += amount;
          totalCommission += itemCommission;
          totalVendorAmount += itemVendorAmount;

          // store breakdown (optional but recommended)
          item.commission = itemCommission;
          item.vendorAmount = itemVendorAmount;

          // mark settled
          item.isSettled = true;
          item.settledAt = new Date();

          settledItemsCount++;
          orderUpdated = true;
        }
      }

      if (orderUpdated) {
        await order.save({ session });
      }
    }

    /* ============================================================
       ❌ NOTHING TO SETTLE
    ============================================================ */
    if (totalPayout === 0) {
      throw new Error("No items eligible for settlement");
    }

    /* ============================================================
       4️⃣ FINAL AMOUNTS
    ============================================================ */
    const commission = totalCommission;
    const vendorAmount = totalVendorAmount;

    /* ============================================================
       5️⃣ VALIDATE ADMIN
    ============================================================ */
    const admin = await Admin.findOne({ role: "ADMIN" }).session(session);

    if (!admin) throw new Error("Admin not found");

    if (admin.wallet.balance < vendorAmount) {
      throw new Error("Insufficient admin balance");
    }

    /* ============================================================
       6️⃣ VALIDATE VENDOR
    ============================================================ */
    const vendor = await Vendor.findById(vendorId).session(session);

    if (!vendor) throw new Error("Vendor not found");

    /* ============================================================
       7️⃣ ADMIN WALLET DEBIT
    ============================================================ */
    await Admin.findByIdAndUpdate(
      admin._id,
      {
        $inc: { "wallet.balance": -vendorAmount },
      },
      { session }
    );

    await Transaction.create(
      [{
        actorType: "ADMIN",
        actorId: admin._id,
        type: "DEBIT",
        amount: vendorAmount,
        source: "SETTLEMENT",
        description: "Vendor payout",
      }],
      { session }
    );

    /* ============================================================
       8️⃣ VENDOR WALLET CREDIT
    ============================================================ */
    await Vendor.findByIdAndUpdate(
      vendorId,
      {
        $inc: { "wallet.balance": vendorAmount },
      },
      { session }
    );

    await Transaction.create(
      [{
        actorType: "VENDOR",
        actorId: vendorId,
        type: "CREDIT",
        amount: vendorAmount,
        source: "SETTLEMENT",
        description: "Payout received from admin",
      }],
      { session }
    );

    /* ============================================================
       ✅ COMMIT TRANSACTION
    ============================================================ */
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      totalItemsPayout: totalPayout,
      commission,
      vendorAmount,
      itemsSettled: settledItemsCount
    };

  } catch (error) {

    /* ============================================================
       ❌ ROLLBACK
    ============================================================ */
    await session.abortTransaction();
    session.endSession();

    console.error("Settlement Error:", error.message);

    throw new Error(error.message || "Settlement failed");
  }
};