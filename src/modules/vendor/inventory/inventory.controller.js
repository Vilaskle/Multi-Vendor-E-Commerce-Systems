import {
  addStockService,
  reduceStockService,
  updateStockService,
  updateThresholdService,
  getProductLogsService,
  getVendorLogsService,
  getLowStockService,
  getVendorInventoryService,
  adminGetLowStockService,
  adminGetAllLogsService,
} from "./inventory.service.js";

// ─── Get All Inventory (vendor) ───────────────────────────────────────────────
export const getVendorInventory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const vendorId = req.user.vendorId;

    const result = await getVendorInventoryService(
      vendorId,
      Number(page),
      Number(limit)
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Low Stock Alerts (vendor) ────────────────────────────────────────────────
export const getLowStockAlerts = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const products = await getLowStockService(vendorId);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── All Vendor Logs ──────────────────────────────────────────────────────────
export const getVendorLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const vendorId = req.user.vendorId;

    const result = await getVendorLogsService(
      vendorId,
      Number(page),
      Number(limit)
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Single Product Logs ──────────────────────────────────────────────────────
export const getProductLogs = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const vendorId = req.user.vendorId;

    const result = await getProductLogsService(
      productId,
      vendorId,
      Number(page),
      Number(limit)
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Add Stock ────────────────────────────────────────────────────────────────
export const addStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, note } = req.body;
    const vendorId = req.user.vendorId;

    const result = await addStockService(productId, vendorId, quantity, note);

    return res.status(200).json({
      success: true,
      message: `Added ${quantity} units`,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Reduce Stock ─────────────────────────────────────────────────────────────
export const reduceStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, note } = req.body;
    const vendorId = req.user.vendorId;

    const result = await reduceStockService(productId, vendorId, quantity, note);

    return res.status(200).json({
      success: true,
      message: `Reduced ${quantity} units`,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Stock (absolute) ──────────────────────────────────────────────────
export const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock, note } = req.body;
    const vendorId = req.user.vendorId;

    const result = await updateStockService(productId, vendorId, stock, note);

    return res.status(200).json({
      success: true,
      message: "Stock updated",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Threshold ─────────────────────────────────────────────────────────
export const updateThreshold = async (req, res) => {
  try {
    const { productId } = req.params;
    const { threshold } = req.body;
    const vendorId = req.user.vendorId;

    const result = await updateThresholdService(productId, vendorId, threshold);

    return res.status(200).json({
      success: true,
      message: "Threshold updated",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: Low Stock Monitor ─────────────────────────────────────────────────
export const adminLowStock = async (req, res) => {
  try {
    const products = await adminGetLowStockService();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: All Logs ──────────────────────────────────────────────────────────
export const adminAllLogs = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;

    const result = await adminGetAllLogsService(Number(page), Number(limit));

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};