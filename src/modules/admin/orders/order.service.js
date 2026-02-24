import Order from "../../../models/Order.js";

// Get all orders
export const getAllOrdersService = async () => {
  return await Order.find()
    .populate("user", "name email")
    .populate("orderItems.product", "name price")
    .sort({ createdAt: -1 });
};

// Get order by ID
export const getOrderByIdService = async (id) => {
  return await Order.findById(id)
    .populate("user", "name email")
    .populate("orderItems.product", "name price");
};

// Update order status
export const updateOrderStatusService = async (id, status) => {
  const order = await Order.findById(id);
  if (!order) return null;

  order.orderStatus = status;
  return await order.save();
};

// Update payment status
export const updatePaymentStatusService = async (id, paymentStatus) => {
  const order = await Order.findById(id);
  if (!order) return null;

  order.paymentStatus = paymentStatus;
  return await order.save();
};

// Mark as delivered
export const markOrderDeliveredService = async (id) => {
  const order = await Order.findById(id);
  if (!order) return null;

  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.orderStatus = "DELIVERED";

  return await order.save();
};

// Delete order (optional)
export const deleteOrderService = async (id) => {
  return await Order.findByIdAndDelete(id);
};
