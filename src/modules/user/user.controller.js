
import {registerUserService,
  verifyEmailOtpService ,
  loginWithPasswordService ,
  requestUserLoginOtpService,
  verifyUserLoginOtpService,
  forgotPasswordService , resetPasswordService ,resendOtpService ,
  getUserProfileService,
  updateUserProfileService,
  addAddressService,
  getAddressesService,
  updateAddressService ,
  deleteAddressService,
  fetchProducts,
  fetchSingleProduct,
  fetchProductFilters,
  addToCartService ,
    getCartService ,
     updateCartItemService ,
      removeCartItemService ,
        clearCartService,
        addToWishlistService,
        getWishlistService,
        removeFromWishlistService,
        getMyOrdersService,
        requestReturnService,
        cancelOrderItemService,
        requestExchangeService,
          addReviewService,
  getProductReviewsService,
   saveRefundDetailsService,
   getHomePageService,
   getOrderPolicyService,
   refreshAccessTokenService,
  logoutUserService, getRecentOrdersService ,validateStockService
} from "./user.service.js";

import {
  createPaymentService,
  verifyPaymentService,
  getCheckoutSummaryService,
} from "../../services/payment/payment.service.js";




export const registerUser = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password, phoneNo } =
      req.body;

    const result = await registerUserService({
      name,
      email,
      password,
      phoneNo,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email using the OTP sent.",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyEmailOtpService({ email, otp });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//login-password
// export const loginWithPassword = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await loginWithPasswordService({ email, password });

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: result,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginWithPasswordService({
      email,
      password,
    });

    // SET REFRESH TOKEN COOKIE
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
     sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// STEP 1: REQUEST OTP
export const requestUserLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

   const result =  await requestUserLoginOtpService(email);

    res.json({
      success: true,
      message: "OTP sent to email",
      data:result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


// STEP 2: VERIFY OTP
// export const verifyUserLoginOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const data = await verifyUserLoginOtpService(email, otp);

//     res.json({
//       success: true,
//       message: "Login successful",
//       data
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

export const verifyUserLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await verifyUserLoginOtpService(
      email,
      otp
    );

    // SET REFRESH TOKEN COOKIE
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await forgotPasswordService({ email });

    res.status(200).json({
      success: true,
      message: "A reset link has been sent to your email",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    await resetPasswordService({ token, newPassword, confirmPassword });

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login again.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    const result = await resendOtpService({ email, type });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await getUserProfileService(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, address } = req.body;

    const updatedUser = await updateUserProfileService(userId, {
      name,
      address,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from JWT

    const addressData = req.body;

    const updatedUser = await addAddressService(userId, addressData);

    return res.status(201).json({
      message: "Address added successfully",
      addresses: updatedUser.addresses,
    });
  } catch (error) {
    //console.error("Add address error:", error.message);

    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const addresses = await getAddressesService(userId);

    res.status(200).json({
      addresses,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};



export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const updatedUser = await updateAddressService(
      userId,
      addressId,
      req.body
    );

    res.status(200).json({
      message: "Address updated successfully",
      addresses: updatedUser.addresses,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const updatedUser = await deleteAddressService(
      userId,
      addressId
    );

    res.status(200).json({
      message: "Address deleted successfully",
      addresses: updatedUser.addresses,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    const data = await fetchProducts(req.query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await fetchSingleProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


export const getProductFilters = async (req, res) => {
  try {
    const filters = await fetchProductFilters(req.query);

    res.status(200).json(filters);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch filters",
    });
  }
};


/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    //console.log("User ID from JWT:", req.user.userId); // ✅ Verify user ID is present
    const userId = req.user.userId;
    // const { productId, quantity } = req.body;
    const {
      productId,
      quantity = 1,
      selectedSize = null,
      selectedColor = null,
    } = req.body;

    const cart = await addToCartService(userId, productId, quantity,  selectedSize,
      selectedColor,);

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= GET CART ================= */
export const getCart = async (req, res) => {
  try {
    const cart = await getCartService(req.user.userId);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// export const updateCartItem = async (req, res) => {
//   try {
//     const { productId, quantity, selectedSize, selectedColor } = req.body;

//     const cart = await updateCartItemService(
//       req.user.userId,
//       productId,
//       quantity,
//       selectedSize,
//       selectedColor
//     );

//     res.status(200).json({
//       success: true,
//       message: "Cart updated",
//       cart,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const removeCartItem = async (req, res) => {
//   try {
//     const { productId, selectedSize, selectedColor } = req.body;

//     const cart = await removeCartItemService(
//       req.user.userId,
//       productId,
//       selectedSize,
//       selectedColor
//     );

//     res.status(200).json({
//       success: true,
//       message: "Item removed from cart",
//       cart,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// /* ================= CLEAR CART ================= */
// export const clearCart = async (req, res) => {
//   try {
//     await clearCartService(req.user.userId);

//     res.status(200).json({
//       success: true,
//       message: "Cart cleared",
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

export const updateCartItem = async (req, res) => {
  try {
   const { quantity } = req.body;
    const { cartItemId } = req.params;

    const cart = await updateCartItemService(
      req.user.userId,
      cartItemId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cart = await removeCartItemService(
      req.user.userId,
      cartItemId
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await clearCartService(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


/* ================= ADD TO WISHLIST ================= */
export const addToWishlist = async (req, res) => {
  try {
    const wishlist = await addToWishlistService(
      req.user.userId,
      req.body.productId
    );

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= GET WISHLIST ================= */
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await getWishlistService(req.user.userId);

    res.status(200).json({ success: true, wishlist });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= REMOVE FROM WISHLIST ================= */
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await removeFromWishlistService(
      req.user.userId,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getCheckoutSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId, from, items } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const summary = await getCheckoutSummaryService({
      userId,
      addressId,
      from,
      items,
    });

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    console.error("Checkout Summary Error:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch checkout summary",
    });
  }
};



// ================= CREATE PAYMENT =================
export const createPayment = async (req, res) => {
  try {
    console.log("🔥 CONTROLLER HIT");
    console.log("🔥 BODY:", req.body);
    const userId = req.user.userId;
    const { addressId, from, items } = req.body;

    const data = await createPaymentService({
      userId,
      addressId,
      from,
      items,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
     console.error("❌ CREATE PAYMENT ERROR FULL:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      stack: error.stack, 
    });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
       items,          // ✅ ADD THIS
      from,  
       paymentMethod, 
    } = req.body;

    const order = await verifyPaymentService({
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
       items,          // ✅ PASS
      from,  
       paymentMethod,

    });

   res.status(200).json({
  success: true,
  message: "Order placed successfully",
  orders: order.orders,
  total: order.total,
  deliveryCharge: order.deliveryCharge,
});

  } catch (error) {
    console.log("VERIFY ERROR:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// export const getMyOrders = async (req, res) => {
//   try {

//     const userId = req.user.userId;

//     const orders = await getMyOrdersService(userId);

//     res.status(200).json({
//       success: true,
//       orders
//     });

//   } catch (error) {

//     res.status(400).json({
//       success: false,
//       message: error.message
//     });

//   }
// };

export const getMyOrders = async (req, res) => {
  try {

    const userId = req.user.userId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const data = await getMyOrdersService(
      userId,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...data,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


// ================= CANCEL ITEM =================
export const cancelOrderItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId, itemId } = req.params;
    const { reason } = req.body;

    const data = await cancelOrderItemService({
      userId,
      orderId,
      itemId,
      reason
    });

    res.status(200).json({
      success: true,
      message: "Item cancelled successfully",
      data
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// ================= RETURN REQUEST =================
export const requestReturn = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId, itemId } = req.params;
   const { reason, refundDetails } = req.body;

    const data = await requestReturnService({
      userId,
      orderId,
      itemId,
      reason,
      refundDetails
    });

    res.status(200).json({
      success: true,
      message: "Return requested successfully",
      data
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



export const requestExchange = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId, itemId } = req.params;
    const { newSize, newColor, reason } = req.body;

    const data = await requestExchangeService({
      userId,
      orderId,
      itemId,
      newSize,
      newColor,
       reason, 
    });

    res.status(200).json({
      success: true,
      message: "Exchange requested successfully",
      data
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const saveRefundDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId, itemId } = req.params;
    const refundDetails = req.body;

    const data = await saveRefundDetailsService({
      userId,
      orderId,
      itemId,
      refundDetails,
    });

    res.status(200).json({
      success: true,
      message: "Refund details saved successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const addReview = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await addReviewService({
      userId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data,
    });

  } catch (error) {
    console.error("Add Review Error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const reviews = await getProductReviewsService(
      req.params.productId
    );

    res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



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


export const getOrderPolicyController = async (req, res) => {
  try {
    const policy = await getOrderPolicyService();

    return res.status(200).json(policy);
  } catch (error) {
    console.error("Error fetching order policy:", error);

    return res.status(500).json({
      message: "Failed to fetch order policy",
    });
  }
};

export const refreshAccessToken = async (
  req,
  res
) => {
  try {
    console.log("Cookies:", req.cookies);
    const refreshToken = req.cookies.refreshToken;

    const accessToken =
      await refreshAccessTokenService(
        refreshToken
      );

    res.status(200).json({
      success: true,
      accessToken,
    });

  } catch (err) {
     console.log(err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};


export const logoutUser = async (req, res) => {
  try {

    await logoutUserService();

    res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getRecentOrders = async (
  req,
  res,
) => {
  try {
    const data = await getRecentOrdersService(
  req.user.userId,
);

res.json({
  success: true,
  totalOrders: data.totalOrders,
  orders: data.recentOrders,
});
  } catch (err) {
    console.error(
      "RECENT ORDER ERROR:",
      err,
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const validateStock = async (req, res) => {
  try {

    const data = await validateStockService({
      userId: req.user.userId,
      from: req.body.from,
      items: req.body.items,
    });

    res.status(200).json(data);

  } catch (err) {

    res.status(400).json({
      message: err.message,
    });
  }
};