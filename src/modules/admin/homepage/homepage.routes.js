import express from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isAdmin }        from "../../../middlewares/roleMiddleware.js";
import upload             from "../../../middlewares/uploadMiddleware.js";
import * as C             from "./homepage.controller.js";

const router  = express.Router();
const admin   = [authMiddleware, isAdmin];
const single  = upload.single("image");
const multi5  = upload.array("images", 5);

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", C.getHomepage);

// ── Hero Banner  (multi-image) ────────────────────────────────────────────────
router.get   ("/hero",     ...admin,        C.getAllHeroBanners);
router.post  ("/hero",     ...admin, multi5, C.createHeroBanner);
router.put   ("/hero/:id", ...admin, multi5, C.updateHeroBanner);
router.patch ("/hero/:id", ...admin,         C.toggleHeroBanner);
router.delete("/hero/:id", ...admin,         C.deleteHeroBanner);

// ── Offer Banner  (single image, type filter: ?type=FESTIVAL|SALE|DISCOUNT) ──
router.get   ("/offers",     ...admin,        C.getAllOfferBanners);
router.post  ("/offers",     ...admin, single, C.createOfferBanner);
router.put   ("/offers/:id", ...admin, single, C.updateOfferBanner);
router.patch ("/offers/:id", ...admin,         C.toggleOfferBanner);
router.delete("/offers/:id", ...admin,         C.deleteOfferBanner);

// ── Offer Grid  (multi-image, up to 4) ───────────────────────────────────────
router.get   ("/offergrid",     ...admin,                        C.getAllOfferGrids);
router.post  ("/offergrid",     ...admin, upload.array("images", 4), C.createOfferGrid);
router.put   ("/offergrid/:id", ...admin, upload.array("images", 4), C.updateOfferGrid);
router.patch ("/offergrid/:id", ...admin,                        C.toggleOfferGrid);
router.delete("/offergrid/:id", ...admin,                        C.deleteOfferGrid);

// ── Promotion Banner  (single image) ─────────────────────────────────────────
router.get   ("/promotions",     ...admin,        C.getAllPromotionBanners);
router.post  ("/promotions",     ...admin, single, C.createPromotionBanner);
router.put   ("/promotions/:id", ...admin, single, C.updatePromotionBanner);
router.patch ("/promotions/:id", ...admin,         C.togglePromotionBanner);
router.delete("/promotions/:id", ...admin,         C.deletePromotionBanner);

// ── Category  (single image) ──────────────────────────────────────────────────
router.get   ("/categories",     ...admin,        C.getAllCategories);
router.post  ("/categories",     ...admin, single, C.createCategory);
router.put   ("/categories/:id", ...admin, single, C.updateCategory);
router.patch ("/categories/:id", ...admin,         C.toggleCategory);
router.delete("/categories/:id", ...admin,         C.deleteCategory);

export default router;