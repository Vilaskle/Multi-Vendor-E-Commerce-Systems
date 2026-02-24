
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
  addToCartService ,
    getCartService ,
     updateCartItemService ,
      removeCartItemService ,
        clearCartService,
        addToWishlistService,
        getWishlistService,
        removeFromWishlistService,
} from "./user.service.js";

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
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginWithPasswordService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
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
export const verifyUserLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await verifyUserLoginOtpService(email, otp);

    res.json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
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



/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    console.log("User ID from JWT:", req.user.userId); // ✅ Verify user ID is present
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    const cart = await addToCartService(userId, productId, quantity);

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

/* ================= UPDATE CART ITEM ================= */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await updateCartItemService(
      req.user.userId,
      productId,
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

/* ================= REMOVE CART ITEM ================= */
export const removeCartItem = async (req, res) => {
  try {
    const cart = await removeCartItemService(
      req.user.userId,
      req.params.productId
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

/* ================= CLEAR CART ================= */
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
