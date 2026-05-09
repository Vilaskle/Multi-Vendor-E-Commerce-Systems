import * as S from "./homepage.service.js";

const ok  = (res, data, code = 200) => res.status(code).json({ success: true, data });
const err = (res, e, code = 400)    => res.status(code).json({ success: false, message: e.message });

// ─── Public ───────────────────────────────────────────────────────────────────
export const getHomepage = async (req, res) => {
  try { ok(res, await S.getHomepageService()); }
  catch (e) { err(res, e, 500); }
};

// ─── Hero Banner ──────────────────────────────────────────────────────────────
export const createHeroBanner = async (req, res) => {
  try { ok(res, await S.createHeroBannerService(req.body, req.files, req.user.adminId), 201); }
  catch (e) { err(res, e); }
};
export const getAllHeroBanners = async (req, res) => {
  try { ok(res, await S.getAllHeroBannersService()); }
  catch (e) { err(res, e, 500); }
};
export const updateHeroBanner = async (req, res) => {
  try { ok(res, await S.updateHeroBannerService(req.params.id, req.body, req.files)); }
  catch (e) { err(res, e); }
};
export const toggleHeroBanner = async (req, res) => {
  try { ok(res, await S.toggleHeroBannerService(req.params.id)); }
  catch (e) { err(res, e); }
};
export const deleteHeroBanner = async (req, res) => {
  try { await S.deleteHeroBannerService(req.params.id); ok(res, { message: "Deleted" }); }
  catch (e) { err(res, e); }
};

// ─── Offer Banner ─────────────────────────────────────────────────────────────
export const createOfferBanner = async (req, res) => {
  try { ok(res, await S.createOfferBannerService(req.body, req.file, req.user.adminId), 201); }
  catch (e) { err(res, e); }
};
export const getAllOfferBanners = async (req, res) => {
  try { ok(res, await S.getAllOfferBannersService(req.query.type)); }
  catch (e) { err(res, e, 500); }
};
export const updateOfferBanner = async (req, res) => {
  try { ok(res, await S.updateOfferBannerService(req.params.id, req.body, req.file)); }
  catch (e) { err(res, e); }
};
export const toggleOfferBanner = async (req, res) => {
  try { ok(res, await S.toggleOfferBannerService(req.params.id)); }
  catch (e) { err(res, e); }
};
export const deleteOfferBanner = async (req, res) => {
  try { await S.deleteOfferBannerService(req.params.id); ok(res, { message: "Deleted" }); }
  catch (e) { err(res, e); }
};

// ─── Offer Grid ───────────────────────────────────────────────────────────────
export const createOfferGrid = async (req, res) => {
  try { ok(res, await S.createOfferGridService(req.body, req.files, req.user.adminId), 201); }
  catch (e) { err(res, e); }
};
export const getAllOfferGrids = async (req, res) => {
  try { ok(res, await S.getAllOfferGridsService()); }
  catch (e) { err(res, e, 500); }
};
export const updateOfferGrid = async (req, res) => {
  try { ok(res, await S.updateOfferGridService(req.params.id, req.body, req.files)); }
  catch (e) { err(res, e); }
};
export const toggleOfferGrid = async (req, res) => {
  try { ok(res, await S.toggleOfferGridService(req.params.id)); }
  catch (e) { err(res, e); }
};
export const deleteOfferGrid = async (req, res) => {
  try { await S.deleteOfferGridService(req.params.id); ok(res, { message: "Deleted" }); }
  catch (e) { err(res, e); }
};

// ─── Promotion Banner ─────────────────────────────────────────────────────────
export const createPromotionBanner = async (req, res) => {
  try { ok(res, await S.createPromotionBannerService(req.body, req.file, req.user.adminId), 201); }
  catch (e) { err(res, e); }
};
export const getAllPromotionBanners = async (req, res) => {
  try { ok(res, await S.getAllPromotionBannersService()); }
  catch (e) { err(res, e, 500); }
};
export const updatePromotionBanner = async (req, res) => {
  try { ok(res, await S.updatePromotionBannerService(req.params.id, req.body, req.file)); }
  catch (e) { err(res, e); }
};
export const togglePromotionBanner = async (req, res) => {
  try { ok(res, await S.togglePromotionBannerService(req.params.id)); }
  catch (e) { err(res, e); }
};
export const deletePromotionBanner = async (req, res) => {
  try { await S.deletePromotionBannerService(req.params.id); ok(res, { message: "Deleted" }); }
  catch (e) { err(res, e); }
};

// ─── Category ─────────────────────────────────────────────────────────────────
export const createCategory = async (req, res) => {
  try { ok(res, await S.createCategoryService(req.body, req.file, req.user.adminId), 201); }
  catch (e) { err(res, e); }
};
export const getAllCategories = async (req, res) => {
  try { ok(res, await S.getAllCategoriesService()); }
  catch (e) { err(res, e, 500); }
};
export const updateCategory = async (req, res) => {
  try { ok(res, await S.updateCategoryService(req.params.id, req.body, req.file)); }
  catch (e) { err(res, e); }
};
export const toggleCategory = async (req, res) => {
  try { ok(res, await S.toggleCategoryService(req.params.id)); }
  catch (e) { err(res, e); }
};
export const deleteCategory = async (req, res) => {
  try { await S.deleteCategoryService(req.params.id); ok(res, { message: "Deleted" }); }
  catch (e) { err(res, e); }
};