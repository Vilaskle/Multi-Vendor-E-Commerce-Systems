import { getHomePageService } from "./home.service.js";

export const getHomePage = async (req, res) => {
  try {
    const data = await getHomePageService();

    res.status(200).json({
      success: true,
      message: "Homepage data fetched successfully",
      data,
    });
  } catch (error) {
    console.error("HOME PAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch homepage data",
    });
  }
};