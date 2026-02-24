import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Product from "../../models/Product.js";
import mongoose from "mongoose";
import { SEARCH_KEYWORD_MAP } from "../../utils/searchMap.js";
import Cart from "../../models/Cart.js";
import Wishlist from "../../models/Wishlist.js";

const MAX_ADDRESSES = 5;


import crypto from "node:crypto";
// import { sendEmailOtp } from "../../services/email/email.service.js";
import { sendOtpEmail } from "../../services/email/email.service.js";

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
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
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
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
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

  // CATEGORY (Men / Women / Kids)
  // CATEGORY (Men / Women / Kids)
// if (category) {
//   filter.category = new RegExp(`^${category}$`, "i");

//   // ❌ EXCLUDE school uniform from Kids category
//   if (
//     category.toLowerCase() === "kids" &&
//     query.tag !== "schooluniform"
//   ) {
//     filter.tags = { $not: /schooluniform/i };
//   }
// }

if (category) {
  filter.category = new RegExp(`^${category}$`, "i");

  if (category.toLowerCase() === "kids" && tag !== "schooluniform") {
    filter.tags = { $not: /schooluniform/i };
  }
}
  // TAGS (topwear, ethnic, festival...)
  if (tag) {
  filter.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
}
//  if (tag) {
//   filter.tags = {
//     $elemMatch: {
//       $regex: new RegExp(`^${tag}$`, "i"),
//     },
//   };
// }

  /* ================= TEXT SEARCH ================= */
  let projection = {};
  let sortQuery = { createdAt: -1 }; // default

  // 🔍 SMART SEARCH
if (search) {
  const keyword = search.toLowerCase();

  const mappedTags = SEARCH_KEYWORD_MAP[keyword];

  // Case 1: keyword matches known intent (pants, shirt, saree...)
  if (mappedTags) {
    filter.tags = {
      $in: mappedTags.map((t) => new RegExp(`^${t}$`, "i")),
    };
  }
  // Case 2: fallback to name search
  else {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { tags: { $regex: keyword, $options: "i" } },
    ];
  }
}

  // PRICE
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // SIZES
  if (sizes) {
    filter.sizes = { $in: sizes.split(",") };
  }

  // COLORS
  if (colors) {
    filter.colors = { $in: colors.split(",") };
  }

  // RATING
  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  // SALE

  if (discount) {
  filter.discount = { $gte: Number(discount) };
}
  // if (discount) {
  //   filter.discount = { $gt: 0 };
  // }

  // TRENDING
  if (isTrending) {
    filter.isTrending = true;
  }


  /* ================= SORT (OVERRIDE IF PROVIDED) ================= */
  if (!search) {
    if (sort === "price_asc") sortQuery = { price: 1 };
    if (sort === "price_desc") sortQuery = { price: -1 };
    if (sort === "newest") sortQuery = { createdAt: -1 };
  }
/* ================= PAGINATION ================= */
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit)),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
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



/* ================= ADD TO CART ================= */
export const addToCartService = async (userId, productId, quantity) => {
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
    (i) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      vendor: product.vendor,
      quantity,
      price: product.price, // snapshot
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

/* ================= UPDATE CART ITEM ================= */
export const updateCartItemService = async (userId, productId, quantity) => {
  if (quantity < 1) throw new Error("Invalid quantity");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) throw new Error("Item not in cart");

  item.quantity = quantity;
  cart.totalPrice = calculateTotal(cart.items);

  await cart.save();
  return cart;
};

/* ================= REMOVE CART ITEM ================= */
export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();

  return cart;
};

/* ================= CLEAR CART ================= */
export const clearCartService = async (userId) => {
  await Cart.findOneAndDelete({ user: userId });
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