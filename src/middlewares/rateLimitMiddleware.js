import rateLimit from "express-rate-limit";

// 🔐 OTP related limiter
export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

// 🔐 Login limiter
export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});
