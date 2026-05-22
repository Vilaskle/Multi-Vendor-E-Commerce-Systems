import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Product from "../../models/Product.js";
import mongoose from "mongoose";
import { SEARCH_KEYWORD_MAP } from "../../utils/searchMap.js";
import Cart from "../../models/Cart.js";
import Wishlist from "../../models/Wishlist.js";
import OrderGroup from "../../models/OrderGroup.js";
import Order from "../../models/Order.js";
import OrderPolicy from "../../models/OrderPolicy.js";
import Payment from "../../models/Payment.js";
import { razorpay } from "../../services/payment/payment.gateway.js";
import Review from "../../models/Review.js";
import HeroBanner from "../../models/HeroBanner.js";
import OfferBanner from "../../models/OfferBanner.js";
import PromotionBanner from "../../models/PromotionBanner.js";
import Category from "../../models/Category.js";
import OfferGrid from "../../models/OfferGrid.js";
import Transaction from "../../models/Transaction.js";
import Admin from "../../models/Admin.js";



import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";

const MAX_ADDRESSES = 5;


import crypto from "node:crypto";
// import { sendEmailOtp } from "../../services/email/email.service.js";
import { sendOtpEmail } from "../../services/email/email.service.js";
import { sendOrderEmail } from "../../services/email/email.service.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUserService = async ({
  name,
  email,
  password,
  phoneNo,
}) => {
  // 1. Basic validation
  if (!name || !email || !password  || !phoneNo) {
    throw new Error("All required fields must be provided");
  }

  // if (password !== confirmPassword) {
  //   throw new Error("Password and confirm password do not match");
  // }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email }).select(
    "+isEmailVerified"
  );

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new Error("Email already registered");
    }

    // user exists but not verified → resend OTP
    const otp = generateOtp();
    existingUser.emailOtp = otp;
    existingUser.emailOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await existingUser.save();

    // await sendUserEmailOtp(email, otp);
      await sendOtpEmail({ to: email, otp, purpose: "REGISTER", role: "USER" });


    return {
      email,
      isEmailVerified: false,
      message: "OTP resent to email",
    };
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Generate OTP
  const otp = generateOtp();

  // 5. Create user (UNVERIFIED)
  const user = await User.create({
    name,
    email,
    phoneNo,
    password: hashedPassword,
    isEmailVerified: false,
    emailOtp: otp,
    emailOtpExpiry: new Date(Date.now() + 5 * 60 * 1000),
  });

  // 6. Send OTP email
  // await sendUserEmailOtp(email, otp);
    await sendOtpEmail({ to: email, otp, purpose: "REGISTER", role: "USER" });


  return {
    id: user._id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
};


export const verifyEmailOtpService = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  if (!user.emailOtp || !user.emailOtpExpiry) {
    throw new Error("OTP not found. Please request a new one");
  }

  if (user.emailOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.emailOtpExpiry < new Date()) {
    throw new Error("OTP expired. Please request a new one");
  }

  // ✅ VERIFY USER
  user.isEmailVerified = true;
  user.emailOtp = null;
  user.emailOtpExpiry = null;

  await user.save();

  return {
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
};


//login-password
export const loginWithPasswordService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // 1. Find user + include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Check email verification
  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in");
  }

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 4. Generate JWT (same style as OTP login)
  // const token = jwt.sign(
  //   {
  //     userId: user._id,
  //     role: user.role,
  //   },
  //   process.env.JWT_SECRET,
  //   { expiresIn: "1d" }
  // );

  const accessToken = generateAccessToken(user);

const refreshToken = generateRefreshToken(user);

return {
  accessToken,
  refreshToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: "USER",
  },
};

};


// STEP 1: REQUEST OTP
export const requestUserLoginOtpService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

   if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  user.emailOtp = otp;
  user.emailOtpExpiry = expiry;
  await user.save();

  // await sendEmailOtp(email, otp);
  await sendOtpEmail({ to: email, otp, purpose: "LOGIN", role: "USER" });
  return {email};
};

// STEP 2: VERIFY OTP
export const verifyUserLoginOtpService = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

 if (user.emailOtp !== otp) {
  throw new Error("Invalid OTP");
}

if (user.emailOtpExpiry < new Date()) {
  throw new Error("OTP expired");
}

  // Clear OTP
  user.emailOtp = null;
  user.emailOtpExpiry = null;
  await user.save();

  // Generate JWT
 const accessToken = generateAccessToken(user);

const refreshToken = generateRefreshToken(user);

return {
  accessToken,
  refreshToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
};

};


export const forgotPasswordService = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
  throw new Error("User not found");
}

if (!user.isEmailVerified) {
  throw new Error("Email not verified");
}


  // 1️⃣ Generate secure token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2️⃣ Hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3️⃣ Save token + expiry
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await user.save();

  // 4️⃣ Create reset link (frontend URL)
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // 5️⃣ Send email (LINK, not OTP)
  await sendOtpEmail({
    to: email,
    otp: resetLink,
    purpose: "RESET_PASSWORD",
    role: "USER",
  });
};

export const resetPasswordService = async ({
  token,
  newPassword,
  confirmPassword,
}) => {
  if (!token || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // 1️⃣ Hash incoming token
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 2️⃣ Find user by token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset link");
  }

  // 3️⃣ Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4️⃣ Update password & clear reset fields
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;

  await user.save();
};


export const resendOtpService = async ({ email, type }) => {
  if (!email || !type) {
    throw new Error("Email and type are required");
  }

  if (!["VERIFY_EMAIL", "RESET_PASSWORD"].includes(type)) {
    throw new Error("Invalid OTP type");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // If verifying email but already verified
  if (type === "VERIFY_EMAIL" && user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  // Generate new OTP
  const otp = generateOtp();

  user.emailOtp = otp;
  user.emailOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  // Decide email purpose
  const purpose =
    type === "VERIFY_EMAIL" ? "REGISTER" : "RESET_PASSWORD";

  await sendOtpEmail({
    to: email,
    otp,
    purpose,
    role: "USER",
  });

  return {
    email,
    type,
  };
};


export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -emailOtp -emailOtpExpiry"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


export const updateUserProfileService = async (userId, updateData) => {
  const allowedFields = {};

  if (updateData.name) allowedFields.name = updateData.name;
  if (updateData.address) allowedFields.address = updateData.address;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: allowedFields },
    { new: true }
  ).select("-emailOtp -emailOtpExpiry");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};


export const addAddressService = async (userId, data) => {
  const {
    fullName,
    phoneNo,
    email,
    addressLine,
    city,
    state,
    pincode,
    isDefault,
  } = data;

  // 🔍 Validation
  if (
    !fullName ||
    !phoneNo ||
    !email ||
    !addressLine ||
    !city ||
    !state ||
    !pincode
  ) {
    const err = new Error("All address fields are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

    // 🚫 MAX ADDRESS LIMIT CHECK
  if (user.addresses.length >= MAX_ADDRESSES) {
    const err = new Error(
      `You can add a maximum of ${MAX_ADDRESSES} addresses`
    );
    err.statusCode = 400;
    throw err;
  }

  // 🔥 STEP 2 LOGIC — ensure only ONE default address
  if (isDefault === true) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  // 📦 Add new address
  user.addresses.push({
    fullName,
    phoneNo,
    email,
    addressLine,
    city,
    state,
    pincode,
    isDefault: isDefault || false,
  });

  await user.save();
  return user;
};

export const getAddressesService = async (userId) => {
  const user = await User.findById(userId).select("addresses");

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user.addresses;
};

export const updateAddressService = async (
  userId,
  addressId,
  data
) => {
  const user = await User.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    const err = new Error("Address not found");
    err.statusCode = 404;
    throw err;
  }

  // 🔥 If setting this address as default
  if (data.isDefault === true) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  // 📝 Update only provided fields
  address.fullName = data.fullName ?? address.fullName;
  address.phoneNo = data.phoneNo ?? address.phoneNo;
  address.email = data.email ?? address.email;
  address.addressLine = data.addressLine ?? address.addressLine;
  address.city = data.city ?? address.city;
  address.state = data.state ?? address.state;
  address.pincode = data.pincode ?? address.pincode;
  address.isDefault =
    data.isDefault ?? address.isDefault;

  await user.save();
  return user;
};

export const deleteAddressService = async (
  userId,
  addressId
) => {
  const user = await User.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    const err = new Error("Address not found");
    err.statusCode = 404;
    throw err;
  }

  // 🚫 Prevent deleting default address
  if (address.isDefault) {
    const err = new Error(
      "Default address cannot be deleted. Please set another address as default first."
    );
    err.statusCode = 400;
    throw err;
  }

  user.addresses.pull({ _id: addressId });
  await user.save();

  return user;
};

// export const fetchProducts = async (query) => {
//   const {
//     category,
//     tag,
//     search,
//     minPrice,
//     maxPrice,
//     sizes,
//     colors,
//     rating,
//     discount,
//     isTrending,
//     sort,
//     page = 1,
//     limit = 12,
//   } = query;

//   const filter = {};


// if (category) {
//   filter.category = new RegExp(`^${category}$`, "i");

//   if (category.toLowerCase() === "kids" && tag !== "schooluniform") {
//     filter.tags = { $not: /schooluniform/i };
//   }
// }
//   // TAGS (topwear, ethnic, festival...)
//   if (tag) {
//   filter.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
// }


//   /* ================= TEXT SEARCH ================= */
//   let projection = {};
//   let sortQuery = { createdAt: -1 }; // default

//   // 🔍 SMART SEARCH
// if (search) {
//   const keyword = search.toLowerCase();

//   const mappedTags = SEARCH_KEYWORD_MAP[keyword];

//   // Case 1: keyword matches known intent (pants, shirt, saree...)
//   if (mappedTags) {
//     filter.tags = {
//       $in: mappedTags.map((t) => new RegExp(`^${t}$`, "i")),
//     };
//   }
//   // Case 2: fallback to name search
//   else {
//     filter.$or = [
//       { name: { $regex: keyword, $options: "i" } },
//       { tags: { $regex: keyword, $options: "i" } },
//     ];
//   }
// }

//   // PRICE
//   if (minPrice || maxPrice) {
//     filter.price = {};
//     if (minPrice) filter.price.$gte = Number(minPrice);
//     if (maxPrice) filter.price.$lte = Number(maxPrice);
//   }

//   // SIZES
//   if (sizes) {
//     filter.sizes = { $in: sizes.split(",") };
//   }

//   // COLORS
//   if (colors) {
//     filter.colors = { $in: colors.split(",") };
//   }

//   // RATING
//   if (rating) {
//     filter.rating = { $gte: Number(rating) };
//   }

//   // SALE

//   if (discount) {
//   filter.discount = { $gte: Number(discount) };
// }
//   // if (discount) {
//   //   filter.discount = { $gt: 0 };
//   // }

//   // TRENDING
//   if (isTrending) {
//     filter.isTrending = true;
//   }


//   /* ================= SORT (OVERRIDE IF PROVIDED) ================= */
//   if (!search) {
//     if (sort === "price_asc") sortQuery = { price: 1 };
//     if (sort === "price_desc") sortQuery = { price: -1 };
//     if (sort === "newest") sortQuery = { createdAt: -1 };
//   }
// /* ================= PAGINATION ================= */
//   const skip = (page - 1) * limit;

//   const [products, total] = await Promise.all([
//     Product.find(filter)
//       .sort(sortQuery)
//       .skip(skip)
//       .limit(Number(limit)),

//     Product.countDocuments(filter),
//   ]);

//   return {
//     products,
//     totalPages: Math.ceil(total / limit),
//     currentPage: Number(page),
//   };
// };

export const fetchProducts = async (query) => {
  const {
    category,
    tag,
    search,
    minPrice,
    maxPrice,
    sizes,
    colors,
    rating,
    discount,
    isTrending,
    sort,
    page = 1,
    limit = 12,
  } = query;

  const filter = {};
  let sortQuery = { createdAt: -1 };

  /* ================= CATEGORY ================= */

  if (category) {
    filter.category = new RegExp(`^${category}$`, "i");
  }

  /* ================= TAG ================= */

  if (tag) {
    filter.tags = {
      $in: [new RegExp(`^${tag}$`, "i")],
    };
  }

  /* ================= KIDS SPECIAL ================= */

  // Exclude schooluniform unless explicitly requested
  if (
    category?.toLowerCase() === "kids" &&
    tag?.toLowerCase() !== "schooluniform"
  ) {
    filter.tags = {
      ...(filter.tags || {}),
      $not: /schooluniform/i,
    };
  }

  /* ================= SEARCH ================= */

  if (search) {
    const keyword = search.toLowerCase().trim();

    const mappedTags = SEARCH_KEYWORD_MAP[keyword];

    // Smart mapped search
    if (mappedTags) {
      filter.$and = filter.$and || [];

      filter.$and.push({
        tags: {
          $in: mappedTags.map(
            (t) => new RegExp(`^${t}$`, "i")
          ),
        },
      });
    }

    // Normal text search
    else {
      filter.$and = filter.$and || [];

      filter.$and.push({
        $or: [
          {
            name: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            tags: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      });
    }
  }

  /* ================= PRICE ================= */

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  /* ================= SIZES ================= */

  if (sizes) {
    const sizeArray = Array.isArray(sizes)
      ? sizes
      : sizes.split(",");

    filter.sizes = {
      $in: sizeArray,
    };
  }

  /* ================= COLORS ================= */

  if (colors) {
    const colorArray = Array.isArray(colors)
      ? colors
      : colors.split(",");

    filter.colors = {
      $in: colorArray,
    };
  }

  /* ================= RATING ================= */

  if (rating) {
    filter.rating = {
      $gte: Number(rating),
    };
  }

  /* ================= DISCOUNT ================= */

  if (discount) {
    filter.discount = {
      $gte: Number(discount),
    };
  }

  /* ================= TRENDING ================= */

  if (isTrending === "true" || isTrending === true) {
    filter.isTrending = true;
  }

  /* ================= SORT ================= */

  if (sort === "price_asc") {
    sortQuery = { price: 1 };
  }

  else if (sort === "price_desc") {
    sortQuery = { price: -1 };
  }

  else if (sort === "newest") {
    sortQuery = { createdAt: -1 };
  }

  else if (sort === "rating") {
    sortQuery = { rating: -1 };
  }

  else if (sort === "discount") {
    sortQuery = { discount: -1 };
  }

  /* ================= PAGINATION ================= */

  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 12;

  const skip = (currentPage - 1) * perPage;

  /* ================= DEBUG ================= */

  console.log("REQ QUERY =>", query);
  console.log("MONGODB FILTER =>", JSON.stringify(filter, null, 2));

  /* ================= FETCH ================= */

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(perPage),

    Product.countDocuments(filter),
  ]);

  /* ================= RESPONSE ================= */

  return {
    products,
    totalProducts: total,
    totalPages: Math.ceil(total / perPage),
    currentPage,
  };
};


export const fetchSingleProduct = async (productId) => {
  // ❌ Invalid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return null;
  }

  const product = await Product.findById(productId);

  return product;
};

export const fetchProductFilters = async (query) => {
  const { category, tag } = query;

  const filter = {};

  /* CATEGORY */

  if (category) {
    filter.category = new RegExp(
      `^${category}$`,
      "i"
    );
  }

  /* TAG */

  if (tag) {
    filter.tags = {
      $in: [new RegExp(`^${tag}$`, "i")],
    };
  }

  /* FETCH PRODUCTS */

  const products = await Product.find(filter);

  /* UNIQUE SIZES */

  const sizes = [
    ...new Set(
      products.flatMap((p) => p.sizes || [])
    ),
  ];

  /* UNIQUE COLORS */

  const colors = [
    ...new Set(
      products.flatMap((p) => p.colors || [])
    ),
  ];

  return {
    sizes,
    colors,
  };
};

/* ================= ADD TO CART ================= */
export const addToCartService = async (userId, productId, quantity,selectedSize,
  selectedColor,) => {
  if (quantity < 1) throw new Error("Quantity must be at least 1");

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (product.stock < quantity)
    throw new Error("Insufficient stock");

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId &&
      i.selectedSize === selectedSize &&
      i.selectedColor === selectedColor,
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      vendor: product.vendor,
        selectedSize,
      selectedColor,
      quantity,
      price:
  product.discount > 0
    ? Math.round(
        product.price *
          (1 - product.discount / 100)
      )
    : product.price,
    });
  }

  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();

  return cart;
};

/* ================= GET CART ================= */
export const getCartService = async (userId) => {
  return Cart.findOne({ user: userId })
    .populate("items.product", "name price images vendor")
    .populate("items.product.vendor", "_id name email status");
};

export const updateCartItemService = async (
  userId,
  cartItemId,
  quantity
) => {

  if (quantity < 1) throw new Error("Invalid quantity");

  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");

  const item = cart.items.id(cartItemId);

  if (!item) throw new Error("Item not found");

  item.quantity = quantity;

  cart.totalPrice = calculateTotal(cart.items);

  await cart.save();

  return cart;
};

export const removeCartItemService = async (
  userId,
  cartItemId
) => {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");

  const item = cart.items.id(cartItemId);

  if (!item) throw new Error("Item not found");

  cart.items = cart.items.filter(
    (item) => item._id.toString() !== cartItemId
  );


  cart.totalPrice = calculateTotal(cart.items);

  await cart.save();

  return cart;
};

export const clearCartService = async (userId) => {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) return;

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();
};

/* ================= HELPER ================= */
const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);



/* ================= ADD ================= */
export const addToWishlistService = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: userId,
      products: [],
    });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  return wishlist;
};

/* ================= GET ================= */
export const getWishlistService = async (userId) => {
  return Wishlist.findOne({ user: userId }).populate(
    "products",
    "name price images"
  );
};

/* ================= REMOVE ================= */
export const removeFromWishlistService = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new Error("Wishlist not found");

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();
  return wishlist;
};



// export const getMyOrdersService = async (userId) => {
//   return await OrderGroup.find({ user: userId })
//     .sort({ createdAt: -1 })
//     .populate({
//       path: "orders",
//       populate: {
//         path: "items.product",
//         select: "name images price",
//       },
//     })
//     .lean();
// };

export const getMyOrdersService = async (
  userId,
  page,
  limit
) => {

  const skip = (page - 1) * limit;

  const query = {
    user: userId,
    orders: { $exists: true, $ne: [] },
  };

  const totalOrders = await OrderGroup.countDocuments(query);

  const orders = await OrderGroup.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "orders",
      populate: {
        path: "items.product",
        select: "name images price",
      },
    })
    .lean();

  return {
    orders,
    totalOrders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit),
  };
};


export const cancelOrderItemService = async ({
  userId,
  orderId,
  itemId,
  reason,
}) => {
  // ✅ 1. Find Order
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) throw new Error("Order not found");

  // ✅ 2. Find Item
  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  // ❌ Already cancelled
  if (item.status === "CANCELLED") {
    throw new Error("Item already cancelled");
  }

  // ❌ Restriction (your existing rule)
  if (["SHIPPED", "DELIVERED"].includes(item.status)) {
    throw new Error("Item cannot be cancelled after shipping");
  }

  // ✅ Fetch policy from DB
const policy = await OrderPolicy.findOne();


const cancelDays = policy?.cancellationWindowDays || 3; // fallback if not set
console.log("Cancellation Policy (days):", cancelDays);
console.log("Item Created At:", item.createdAt);
// ✅ Calculate days
const itemDate = new Date(item.createdAt);
const now = new Date();
const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);

// ❌ Apply dynamic restriction
if (diffDays > cancelDays) {
  throw new Error(`Cancellation period expired (${cancelDays} days)`);
}

  // ✅ 3. Calculate refund amount (IN PAISE)
  const refundAmount = item.price * item.quantity * 100;

  // ✅ 4. Find Payment (IMPORTANT FIX)
  const payment = await Payment.findOne({
    orders: orderId,
    status: "SUCCESS",
  });

  let refundSuccess = false;

  if (payment && payment.razorpayPaymentId) {
    try {
      // ✅ 5. Razorpay Refund
      const refund = await razorpay.payments.refund(
        payment.razorpayPaymentId,
        {
          amount: refundAmount,
          speed: "optimum",
        }
      );

      // ✅ Save refund details in item
      item.refundStatus = "COMPLETED";
      item.refundId = refund.id;
      item.refundAmount = refundAmount / 100;

      refundSuccess = true;

// 🔥 ADD THIS BLOCK HERE
const admin = await Admin.findOne({ role: "ADMIN" });

const refundAmountRupees = item.price * item.quantity;

await Transaction.create({
  actorType: "ADMIN",
  actorId: admin._id,
  type: "DEBIT",
  amount: refundAmountRupees,
  source: "REFUND",
  referenceId: order._id,
});

await Admin.findByIdAndUpdate(admin._id, {
  $inc: { "wallet.balance": -refundAmountRupees },
});

    } catch (error) {
      console.error("Refund Error:", error);

      // fallback
      item.refundStatus = "PENDING";
    }
  } else {
    console.warn("No payment found, skipping refund");
    item.refundStatus = "NONE";
  }

  // ✅ 6. Update Item Status
  item.status = "CANCELLED";
  item.cancelReason = reason;

  // ✅ 7. Restore Product Stock
  const product = await Product.findById(item.product);
  if (product) {
    product.stock += item.quantity;
    await product.save();
  }

  // // ✅ 8. Update Order Status (optional but good)
  // const allCancelled = order.items.every(
  //   (i) => i.status === "CANCELLED"
  // );

  // if (allCancelled) {
  //   order.orderStatus = "CANCELLED";
  // }

  // ✅ 8. Update Order Status
const allCancelled = order.items.every(
  (i) => i.status === "CANCELLED"
);

if (allCancelled) {
  order.orderStatus = "CANCELLED";

  // 🔥 ADD THIS BLOCK HERE
  const orderGroup = await OrderGroup.findById(order.orderGroup);

  if (orderGroup && orderGroup.deliveryCharge > 0) {

    const deliveryRefund = orderGroup.deliveryCharge;

    console.log("🚀 Refunding delivery charge:", deliveryRefund);

    // 💳 Refund via Razorpay (if online)
    if (payment && payment.razorpayPaymentId) {
      try {
        await razorpay.payments.refund(payment.razorpayPaymentId, {
          amount: deliveryRefund * 100, // paise
        });
      } catch (err) {
        console.error("Delivery refund failed:", err);
      }
    }

    // 💰 ADMIN WALLET DEBIT
    const admin = await Admin.findOne({ role: "ADMIN" });

    await Transaction.create({
      actorType: "ADMIN",
      actorId: admin._id,
      type: "DEBIT",
      amount: deliveryRefund,
      source: "REFUND",
      referenceId: order._id,
    });

    await Admin.findByIdAndUpdate(admin._id, {
      $inc: { "wallet.balance": -deliveryRefund },
    });
  }
}

  // ✅ 9. Save Order
  await order.save();

  // ✅ 10. Send Email Notification
try {
  const user = await User.findById(userId);

  if (user) {
    // 📩 CANCEL EMAIL
   await sendOrderEmail({
  to: user.email,
  name: user.name || "User",
  type: "CANCEL",
  orderId: order._id.toString().slice(-6),
  orderDate: order.createdAt.toDateString(),
  amount: item.price * item.quantity,
  refundId: item.refundId || "N/A", // ✅ important
   paymentMethod: order.paymentMethod
});

  }
} catch (emailError) {
  console.error("Email Error:", emailError);
}

  return {
    order,
    refundSuccess,
    message: refundSuccess
      ? "Item cancelled and refunded successfully"
      : "Item cancelled (refund pending)",
  };
};

export const requestReturnService = async ({
  userId,
  orderId,
  itemId,
  reason,
  refundDetails 
}) => {

  // ✅ 1. Find Order
  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) throw new Error("Order not found");

  // ✅ 2. Find Item
  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  // ❌ Only delivered items can be returned
  if (item.status !== "DELIVERED") {
    throw new Error("Return allowed only after delivery");
  }

  // ❌ Already requested
  if (item.status === "RETURN_REQUESTED") {
    throw new Error("Return already requested");
  }

  

  // ✅ 3. Fetch Policy
  const policy = await OrderPolicy.findOne();
  const returnDays = policy?.returnWindowDays || 7;

  // ✅ 4. Check return window (based on delivery date or createdAt fallback)
  const baseDate = item.deliveredAt || item.createdAt;
  const now = new Date();
  const diffDays = (now - new Date(baseDate)) / (1000 * 60 * 60 * 24);

  if (diffDays > returnDays) {
    throw new Error(`Return window expired (${returnDays} days)`);
  }

  // ✅ 5. Update Item
  item.status = "RETURN_REQUESTED";
  item.returnReason = reason;

  // ✅ CHECK PAYMENT METHOD
if (order.paymentMethod === "COD") {

  if (!refundDetails) {
    throw new Error("Refund details required for COD orders");
  }

  // ✅ STORE REFUND DETAILS
  item.refundDetails = refundDetails;
  item.refundStatus = "PENDING";

} else {
  // ONLINE PAYMENT
  item.refundStatus = "PENDING"; // Razorpay refund later
}

  await order.save();

  // ✅ 6. Populate for email
  await order.populate("items.product");

  // ✅ 7. Send Email
  try {
    const user = await User.findById(userId);
    console.log("USER EMAIL:", user?.email);

    if (user) {
      await sendOrderEmail({
        to: user.email,
        name: user.name || "User",
        type: "RETURN_REQUESTED",
        orderId: order._id.toString().slice(-6),
        productName: item.product?.name,
        quantity: item.quantity,
        reason,
         refundDetails: item.refundDetails
      });
    }
  } catch (err) {
    console.error("Return Email Error:", err);
  }

  return order;
};


export const requestExchangeService = async ({
  userId,
  orderId,
  itemId,
  newSize,
  newColor,
  reason,
}) => {

  /* ================= 1. FIND ORDER ================= */
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) throw new Error("Order not found");

  /* ================= 2. FIND ITEM ================= */
  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  /* ================= 3. VALIDATIONS ================= */

  if (item.status !== "DELIVERED") {
    throw new Error("Exchange allowed only after delivery");
  }

  if (item.exchangeStatus !== "NONE") {
    throw new Error("Exchange already processed/requested");
  }

  /* ================= 4. VALIDATE REASON ================= */
  if (!reason || reason.trim().length < 3) {
    throw new Error("Please provide a valid reason");
  }

  /* ================= 5. WINDOW CHECK ================= */
  const policy = await OrderPolicy.findOne();
  const exchangeDays = policy?.exchangeWindowDays || 7;

  const baseDate = item.deliveredAt || item.createdAt;

  const diffDays =
    (new Date() - new Date(baseDate)) / (1000 * 60 * 60 * 24);

  if (diffDays > exchangeDays) {
    throw new Error(`Exchange window expired (${exchangeDays} days)`);
  }

  /* ================= 6. VALIDATE INPUT ================= */
  if (!newSize && !newColor) {
    throw new Error("Select size or color");
  }

  if (
    (newSize || item.selectedSize) === item.selectedSize &&
    (newColor || item.selectedColor) === item.selectedColor
  ) {
    throw new Error("Select different variant");
  }

  /* ================= 7. LOAD PRODUCT ================= */
  await order.populate("items.product");

  const product = item.product;

  if (!product) {
    throw new Error("Product no longer available");
  }

  /* ================= 8. VALIDATE VARIANT ================= */

  // ✅ Validate size
  if (newSize && !product.sizes.includes(newSize)) {
    throw new Error("Invalid size selected");
  }

  // ✅ Validate color
  if (newColor && !product.colors.includes(newColor)) {
    throw new Error("Invalid color selected");
  }

  // ✅ Check stock
  if (product.stock !== undefined && product.stock <= 0) {
    throw new Error("Product is out of stock");
  }

  /* ================= 9. UPDATE EXISTING ITEM ================= */

  item.exchangeStatus = "REQUESTED";
  item.status = "EXCHANGE_REQUESTED";

  item.exchangeRequest = {
    newSize: newSize ?? item.selectedSize,
    newColor: newColor ?? item.selectedColor,
    reason,
    requestedAt: new Date(),
  };

  item.exchangeRequestedAt = new Date();

  await order.save();

  /* ================= 10. EMAIL ================= */
  try {
    const user = await User.findById(userId);

    if (user) {
      await sendOrderEmail({
        to: user.email,
        name: user.name || "User",
        type: "EXCHANGE_REQUESTED",
        orderId: order._id.toString().slice(-6),
        productName: product?.name,
        oldSize: item.selectedSize,
        newSize: item.exchangeRequest.newSize,
        oldColor: item.selectedColor,
        newColor: item.exchangeRequest.newColor,
      });
    }
  } catch (err) {
    console.error("Email error:", err);
  }

  return order;
};

export const saveRefundDetailsService = async ({
  userId,
  orderId,
  itemId,
  refundDetails,
}) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) throw new Error("Order not found");

  const item = order.items.id(itemId);
  if (!item) throw new Error("Item not found");

  // ❌ Only allow for COD
  if (order.paymentMethod !== "COD") {
    throw new Error("Refund details only required for COD orders");
  }

  // ❌ Only after return requested
  if (item.status !== "RETURN_REQUESTED") {
    throw new Error("Refund details can be added only after return request");
  }

  // ✅ Save details
  item.refundDetails = refundDetails;
  item.refundStatus = "PENDING";

  await order.save();

  return order;
};


export const addReviewService = async ({
  userId,
  productId,
  orderId,
  orderItemId,
  rating,
  comment,
}) => {

  /* ================= VALIDATE INPUT ================= */
  if (!productId || !orderId || !orderItemId) {
    throw new Error("Missing required fields");
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  /* ================= FIND ORDER ================= */
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  /* ================= FIND ITEM ================= */
  const item = order.items.id(orderItemId);

  if (!item) {
    throw new Error("Order item not found");
  }

  /* ================= VALIDATIONS ================= */

  // product match
  if (item.product.toString() !== productId) {
    throw new Error("Product mismatch");
  }

  // must be delivered
  if (item.status !== "DELIVERED") {
    throw new Error("Only delivered items can be reviewed");
  }

  // prevent duplicate
  if (item.reviewed) {
    throw new Error("Already reviewed");
  }

  // prevent return items
  if (
    ["RETURN_REQUESTED", "RETURN_APPROVED", "REFUNDED"].includes(item.status)
  ) {
    throw new Error("Cannot review returned items");
  }

  /* ================= CREATE REVIEW ================= */
  const review = await Review.create({
    user: userId,
    product: productId,
    order: orderId,
    orderItemId,
    rating,
    comment,
  });

  /* ================= MARK ITEM AS REVIEWED ================= */
  item.reviewed = true;
  await order.save();

  /* ================= UPDATE PRODUCT RATING ================= */
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats[0].avgRating,
    numReviews: stats[0].total,
  });

  return review;
};


export const getProductReviewsService = async (productId) => {

  const reviews = await Review.find({
    product: productId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return reviews;
};



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



export const getOrderPolicyService = async () => {
  // assuming only one policy document exists
  const policy = await OrderPolicy.findOne().lean();

  if (!policy) {
    throw new Error("Order policy not found");
  }

  return {
    cancellationWindowDays: policy.cancellationWindowDays,
    returnWindowDays: policy.returnWindowDays,
    exchangeWindowDays: policy.exchangeWindowDays,
  };
};





export const createOrderService = async (data, userId) => {
  const order = new Order({
    user: userId,
    items: data.items,
    totalAmount: data.totalAmount,

    // 🔥 ADD HERE
    trackingHistory: [
      {
        status: "PLACED",
        message: "Your order has been placed",
      },
    ],
  });

  await order.save();

  return order;
};


export const refreshAccessTokenService = async (
  refreshToken
) => {
  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const accessToken = jwt.sign(
    {
      userId: decoded.userId,
       role: decoded.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1m",
    }
  );

  return accessToken;
};

export const logoutUserService = async () => {
  return true;
};

export const getRecentOrdersService = async (userId) => {
  
const totalOrders = await OrderGroup.countDocuments({
  user: userId,
  orders: { $exists: true, $ne: [] },
});

  const recentOrders = await OrderGroup.find({
    user: userId,
    orders: { $exists: true, $ne: [] },
  })
    .select(
      "orders totalAmount createdAt paymentStatus"
    )
    .sort({ createdAt: -1 })
    .limit(3)
    .populate({
      path: "orders",
      select:
        "items totalAmount paymentStatus createdAt",
      populate: {
        path: "items.product",
        model: "Product",
        select: "name images",
      },
    })
    .lean();


  return {
    totalOrders,
    recentOrders,
  };
};


export const validateStockService = async ({
  userId,
  from,
  items,
}) => {

  let sourceItems = [];

  if (from === "cart") {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) throw new Error("Cart not found");

    sourceItems = items
      .map((id) => cart.items.id(id))
      .filter(Boolean);

  } else {
    sourceItems = items;
  }

  for (const item of sourceItems) {

    const productId =
      typeof item.product === "object"
        ? item.product._id
        : item.product;

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const qty = item.quantity || 1;

    if (product.stock < qty) {
      throw new Error(
        `Only ${product.stock} item(s) available for ${product.name}`
      );
    }
  }

  return {
    success: true,
  };
};