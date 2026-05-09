import express from "express";
import {
  getVendorOrders,
 // updateVendorOrderStatus,
} from "./order.controller.js";

import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isVendor } from "../../../middlewares/roleMiddleware.js";


const router = express.Router();

router.get("/", authMiddleware, isVendor, getVendorOrders);

//router.patch("/:id/status", authMiddleware, isVendor, updateVendorOrderStatus);


export default router;