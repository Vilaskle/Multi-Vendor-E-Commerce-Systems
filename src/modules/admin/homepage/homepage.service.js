import HeroBanner      from "../../../models/HeroBanner.js";
import OfferBanner     from "../../../models/OfferBanner.js";
import OfferGrid       from "../../../models/OfferGrid.js";
import PromotionBanner from "../../../models/PromotionBanner.js";
import Category        from "../../../models/Category.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../../utils/cloudinaryUpload.js";

// ─── helpers ──────────────────────────────────────────────────────────────────

const now = () => new Date();

// returns banners whose date window contains right now
const activeDateFilter = () => ({
  isActive:  true,
  startDate: { $lte: now() },
  endDate:   { $gte: now() },
});

// upload one file → { url, public_id }
const uploadOne = async (file, folder) => {
  const res = await uploadToCloudinary(file.buffer, folder);
  return { url: res.secure_url, public_id: res.public_id };
};

// upload many files → [{ url, public_id }]
const uploadMany = async (files, folder) => {
  const results = [];
  for (const file of files) results.push(await uploadOne(file, folder));
  return results;
};

// ─── 1. Public: full homepage payload ─────────────────────────────────────────

export const getHomepageService = async () => {
  const dateFilter = activeDateFilter();

  const [heroBanners, offerBanners, offerGrids, promotionBanners, categories] =
    await Promise.all([
      HeroBanner.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
      OfferBanner.find(dateFilter).sort({ displayOrder: 1 }).lean(),
      OfferGrid.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
      PromotionBanner.find(dateFilter).sort({ displayOrder: 1 }).lean(),
      Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
    ]);

  // section 1 — hero (first active banner only)
  const hero = heroBanners[0]
    ? {
        title:    heroBanners[0].title,
        subtitle: heroBanners[0].subtitle,
        images:   heroBanners[0].images.map((i) => i.url),
      }
    : null;

  // section 2 — offer banners grouped by type
  const groupOffers = (type) =>
    offerBanners
      .filter((b) => b.type === type)
      .map((b) => ({ id: b._id, title: b.title, subtitle: b.subtitle, image: b.image.url, link: b.link }));

  const offers = {
    festival: groupOffers("FESTIVAL"),
    sale:     groupOffers("SALE"),
    discount: groupOffers("DISCOUNT"),
  };

  // section 3 — offer grids (men / women / kids)
  const grids = offerGrids.map((g) => ({
    id:       g._id,
    title:    g.title,
    category: g.category,
    images:   g.images.map((i) => i.url),
  }));

  // section 4 — promotion banners
  const promos = promotionBanners.map((p) => ({
    id:       p._id,
    title:    p.title,
    subtitle: p.subtitle,
    type:     p.type,
    image:    p.image.url,
    link:     p.link,
  }));

  // section 5 — shop by category
  const cats = categories.map((c) => ({
    id:    c._id,
    name:  c.name,
    slug:  c.slug,
    image: c.image.url,
  }));

  return { hero, offers, grids, promos, categories: cats };
};

// ═══════════════════════════════════════════════════════════════════════════════
// HERO BANNER CRUD
// ═══════════════════════════════════════════════════════════════════════════════

export const createHeroBannerService = async (data, files, adminId) => {
  if (!files?.length) throw new Error("At least one image is required");
  const images = await uploadMany(files, "banners/hero");
  return HeroBanner.create({ ...data, images, createdBy: adminId });
};

export const getAllHeroBannersService = () =>
  HeroBanner.find().sort({ displayOrder: 1 });

export const updateHeroBannerService = async (id, data, files) => {
  const banner = await HeroBanner.findById(id);
  if (!banner) throw new Error("Hero banner not found");

  if (files?.length) {
    // delete old images from cloudinary
    for (const img of banner.images) {
      if (img.public_id) await deleteFromCloudinary(img.public_id);
    }
    banner.images = await uploadMany(files, "banners/hero");
  }

  Object.assign(banner, data);
  return banner.save();
};

export const toggleHeroBannerService = async (id) => {
  const banner = await HeroBanner.findById(id);
  if (!banner) throw new Error("Hero banner not found");
  banner.isActive = !banner.isActive;
  return banner.save();
};

export const deleteHeroBannerService = async (id) => {
  const banner = await HeroBanner.findByIdAndDelete(id);
  if (!banner) throw new Error("Hero banner not found");
  for (const img of banner.images) {
    if (img.public_id) await deleteFromCloudinary(img.public_id);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// OFFER BANNER CRUD
// ═══════════════════════════════════════════════════════════════════════════════

export const createOfferBannerService = async (data, file, adminId) => {
  if (!file) throw new Error("Image is required");
  const image = await uploadOne(file, "banners/offers");
  return OfferBanner.create({ ...data, image, createdBy: adminId });
};

export const getAllOfferBannersService = (type) => {
  const filter = type ? { type } : {};
  return OfferBanner.find(filter).sort({ displayOrder: 1 });
};

export const updateOfferBannerService = async (id, data, file) => {
  const banner = await OfferBanner.findById(id);
  if (!banner) throw new Error("Offer banner not found");

  if (file) {
    if (banner.image?.public_id) await deleteFromCloudinary(banner.image.public_id);
    banner.image = await uploadOne(file, "banners/offers");
  }

  Object.assign(banner, data);
  return banner.save();
};

export const toggleOfferBannerService = async (id) => {
  const banner = await OfferBanner.findById(id);
  if (!banner) throw new Error("Offer banner not found");
  banner.isActive = !banner.isActive;
  return banner.save();
};

export const deleteOfferBannerService = async (id) => {
  const banner = await OfferBanner.findByIdAndDelete(id);
  if (!banner) throw new Error("Offer banner not found");
  if (banner.image?.public_id) await deleteFromCloudinary(banner.image.public_id);
};

// ═══════════════════════════════════════════════════════════════════════════════
// OFFER GRID CRUD  (your existing logic, just added image cleanup)
// ═══════════════════════════════════════════════════════════════════════════════

export const createOfferGridService = async (data, files, adminId) => {
  if (!files?.length) throw new Error("At least one image is required");
  const images = await uploadMany(files, "homepage/offergrid");
  return OfferGrid.create({ ...data, images, createdBy: adminId });
};

export const getAllOfferGridsService = () =>
  OfferGrid.find().sort({ displayOrder: 1 });

export const updateOfferGridService = async (id, data, files) => {
  const grid = await OfferGrid.findById(id);
  if (!grid) throw new Error("Offer grid not found");

  if (files?.length) {
    for (const img of grid.images) {
      if (img.public_id) await deleteFromCloudinary(img.public_id);
    }
    grid.images = await uploadMany(files, "homepage/offergrid");
  }

  Object.assign(grid, data);
  return grid.save();
};

export const toggleOfferGridService = async (id) => {
  const grid = await OfferGrid.findById(id);
  if (!grid) throw new Error("Offer grid not found");
  grid.isActive = !grid.isActive;
  return grid.save();
};

export const deleteOfferGridService = async (id) => {
  const grid = await OfferGrid.findByIdAndDelete(id);
  if (!grid) throw new Error("Offer grid not found");
  for (const img of grid.images) {
    if (img.public_id) await deleteFromCloudinary(img.public_id);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROMOTION BANNER CRUD
// ═══════════════════════════════════════════════════════════════════════════════

export const createPromotionBannerService = async (data, file, adminId) => {
  if (!file) throw new Error("Image is required");
  const image = await uploadOne(file, "banners/promotions");
  return PromotionBanner.create({ ...data, image, createdBy: adminId });
};

export const getAllPromotionBannersService = () =>
  PromotionBanner.find().sort({ displayOrder: 1 });

export const updatePromotionBannerService = async (id, data, file) => {
  const promo = await PromotionBanner.findById(id);
  if (!promo) throw new Error("Promotion banner not found");

  if (file) {
    if (promo.image?.public_id) await deleteFromCloudinary(promo.image.public_id);
    promo.image = await uploadOne(file, "banners/promotions");
  }

  Object.assign(promo, data);
  return promo.save();
};

export const togglePromotionBannerService = async (id) => {
  const promo = await PromotionBanner.findById(id);
  if (!promo) throw new Error("Promotion banner not found");
  promo.isActive = !promo.isActive;
  return promo.save();
};

export const deletePromotionBannerService = async (id) => {
  const promo = await PromotionBanner.findByIdAndDelete(id);
  if (!promo) throw new Error("Promotion banner not found");
  if (promo.image?.public_id) await deleteFromCloudinary(promo.image.public_id);
};

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY CRUD
// ═══════════════════════════════════════════════════════════════════════════════

export const createCategoryService = async (data, file, adminId) => {
  if (!file) throw new Error("Image is required");
  const image = await uploadOne(file, "categories");
  return Category.create({ ...data, image, createdBy: adminId });
};

export const getAllCategoriesService = () =>
  Category.find().sort({ displayOrder: 1 });

export const updateCategoryService = async (id, data, file) => {
  const cat = await Category.findById(id);
  if (!cat) throw new Error("Category not found");

  if (file) {
    if (cat.image?.public_id) await deleteFromCloudinary(cat.image.public_id);
    cat.image = await uploadOne(file, "categories");
  }

  Object.assign(cat, data);
  return cat.save();
};

export const toggleCategoryService = async (id) => {
  const cat = await Category.findById(id);
  if (!cat) throw new Error("Category not found");
  cat.isActive = !cat.isActive;
  return cat.save();
};

export const deleteCategoryService = async (id) => {
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) throw new Error("Category not found");
  if (cat.image?.public_id) await deleteFromCloudinary(cat.image.public_id);
};