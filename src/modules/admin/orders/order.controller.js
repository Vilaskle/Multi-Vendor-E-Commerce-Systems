import {
  getAllOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  updatePaymentStatusService,
  markOrderDeliveredService,
  deleteOrderService,
} from "./order.service.js";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdService(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await updateOrderStatusService(req.params.id, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await updatePaymentStatusService(
      req.params.id,
      paymentStatus
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating payment status",
    });
  }
};

// Mark as delivered
export const markOrderDelivered = async (req, res) => {
  try {
    const order = await markOrderDeliveredService(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking order delivered",
    });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    await deleteOrderService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
    });
  }
};
