export const isUser = (req, res, next) => {
  if (req.user.role !== "USER") {
    return res.status(403).json({
      success: false,
      message: "Access denied: User only",
    });
  }
  next();
};

export const isVendor = (req, res, next) => {
  if (!req.user || req.user.role.toUpperCase() !== "VENDOR") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Vendor only",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin only",
    });
  }
  next();
};
