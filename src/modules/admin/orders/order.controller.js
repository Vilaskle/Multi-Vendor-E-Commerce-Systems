// import {
//   getAllOrdersService,
//   getOrderByIdService,
//   updateOrderStatusService,
//   updatePaymentStatusService,
//   markOrderDeliveredService,
//   deleteOrderService,
// } from "./order.service.js";

// // Get all orders
// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await getAllOrdersService();

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch orders",
//     });
//   }
// };

// // Get single order
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await getOrderByIdService(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching order",
//     });
//   }
// };

// // Update order status
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const order = await updateOrderStatusService(req.params.id, status);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order status updated",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating order status",
//     });
//   }
// };

// // Update payment status
// export const updatePaymentStatus = async (req, res) => {
//   try {
//     const { paymentStatus } = req.body;

//     const order = await updatePaymentStatusService(
//       req.params.id,
//       paymentStatus
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Payment status updated",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating payment status",
//     });
//   }
// };

// // Mark as delivered
// export const markOrderDelivered = async (req, res) => {
//   try {
//     const order = await markOrderDeliveredService(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order marked as delivered",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error marking order delivered",
//     });
//   }
// };

// // Delete order
// export const deleteOrder = async (req, res) => {
//   try {
//     await deleteOrderService(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting order",
//     });
//   }
// };

import {
 getAllOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  //updatePaymentStatusService,
  //markOrderDeliveredService,
  deleteOrderService,
  //getAdminWalletService,
  getAdminOrdersListService,
  getAdminOrderDetailService,
  updateItemStatusService,
  getAdminOrderGroupsListService,    // ← ADD THIS
  getAdminOrderGroupDetailService,  
  approveReturnService,rejectReturnService,refundReturnService,shipExchangeService, // ← ADD THIS

} from "./order.service.js";
//import { createOrderService } from "./order.service.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
  
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await updateOrderStatusService(
      req.params.id,
      status
    );

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// export const updatePaymentStatus = async (req, res) => {
//   try {
//     const { paymentStatus } = req.body;

//     const order = await updatePaymentStatusService(
//       req.params.id,
//       paymentStatus
      
//     );

//     res.status(200).json({
//       success: true,
//       message: "Payment status updated successfully",
//       data: order,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// export const markOrderDelivered = async (req, res) => {
//   try {
//     const order = await markOrderDeliveredService(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: "Order marked as delivered",
//       data: order,
//     });
//   } catch (error) {
//     res.status(404).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const deleteOrder = async (req, res) => {
  try {
    await deleteOrderService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// export const createOrder = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body is missing",
//       });
//     }

//     const order = await createOrderService(req.body);

//     res.status(201).json({
//       success: true,
//       data: order,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };



// ─────────────────────────────────────────────────────────────────────────────
// NEW: Order list for AdminOrders.jsx (order blocks with PENDING/DELIVERED)
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrdersList = async (req, res) => {
  try {
    const orders = await getAdminOrdersListService();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ─────────────────────────────────────────────────────────────────────────────
// NEW: Single order detail for AdminOrderDetail.jsx
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrderDetail = async (req, res) => {
  try {
    const order = await getAdminOrderDetailService(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};


// ─────────────────────────────────────────────────────────────────────────────
// NEW: Update individual item status inside an order
// 
export const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    console.log("=== updateItemStatus HIT ===");
    console.log("orderId:", orderId);
    console.log("itemId:", itemId);
    console.log("status:", status);

    const result = await updateItemStatusService(orderId, itemId, status);
    console.log("result:", result);

    res.status(200).json({
      success: true,
      message: "Item status updated",
      allDelivered: result.allDelivered,
      item: result.item,
    });
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADD THESE to the bottom of your existing order.controller.js
// Also add the two imports to the existing import block at the top:
//
//   import {
//     ...your existing imports...
//     getAdminOrderGroupsListService,    // NEW
//     getAdminOrderGroupDetailService,   // NEW
//   } from "./order.service.js";
//
// ─────────────────────────────────────────────────────────────────────────────


// GET /admin/orders/groups/all
// AdminOrders.jsx  →  fetchGroups()
export const getAdminOrderGroupsList = async (req, res) => {
  try {
    const groups = await getAdminOrderGroupsListService();
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET /admin/orders/groups/:groupId
// AdminOrderGroupDetail.jsx  →  fetchGroup()
export const getAdminOrderGroupDetail = async (req, res) => {
  try {
    const group = await getAdminOrderGroupDetailService(req.params.groupId);
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
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
