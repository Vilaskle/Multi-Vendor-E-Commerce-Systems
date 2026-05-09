import HeroBanner from "../../models/HeroBanner.js";
import OfferBanner from "../../models/OfferBanner.js";
import PromotionBanner from "../../models/PromotionBanner.js";
import Category from "../../models/Category.js";
import OfferGrid from "../../models/OfferGrid.js";

export const getHomePageService = async () => {
  const now = new Date();

  // Fetch all in parallel 🚀
  const [
    heroBanners,
    offerBanners,
    promotionBanners,
    categories,
    offerGrid,
  ] = await Promise.all([
    HeroBanner.find({ isActive: true }).sort({ displayOrder: 1 }),

    OfferBanner.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ displayOrder: 1 }),

    PromotionBanner.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ displayOrder: 1 }),

    Category.find({ isActive: true }).sort({ displayOrder: 1 }),

    OfferGrid.find({ isActive: true }).sort({ displayOrder: 1 }),
  ]);

  return {
    heroBanners,
    offerBanners,
    promotionBanners,
    categories,
    offerGrid,
  };
};