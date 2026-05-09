import {
  getVendorOrdersService
} from "./order.service.js";

export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const orders = await getVendorOrdersService(vendorId);

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
