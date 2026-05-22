// import Cart from "../../models/Cart.js";
// import User from "../../models/User.js";
// import Order from "../../models/Order.js";
// import Payment from "../../models/Payment.js";
// import Product from "../../models/Product.js";
// import Vendor from "../../models/Vendor.js";
// import OrderGroup from "../../models/OrderGroup.js";
// import PlatformSettings from "../../models/PlatformSettings.js";
// import mongoose from "mongoose";
// import Transaction from "../../models/Transaction.js";
// import Admin from "../../models/Admin.js";



// import {
//   createRazorpayOrder,
//   verifyRazorpaySignature,
// } from "./payment.gateway.js";



// export const getCheckoutSummaryService = async ({
//   userId,
//   addressId,
//   from,
//   items,
// }) => {
//   const user = await User.findById(userId);
//   if (!user) throw new Error("User not found");

//   const address = user.addresses.id(addressId);
//   console.log("USER ADDRESSES:", user.addresses);
// console.log("REQUESTED ADDRESS ID:", addressId);
//   if (!address) throw new Error("Invalid address");

//   let orderItems = [];

//   /* BUY NOW */
//   if (from === "buyNow") {
//     if (!items || !items.length)
//       throw new Error("Buy now items missing");

//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) throw new Error("Product not found");

//       if (product.stock < item.quantity)
//         throw new Error(`${product.name} out of stock`);

//       orderItems.push({
//   price:
//     product.discount > 0
//       ? Math.round(product.price * (1 - product.discount / 100))
//       : product.price,

//   quantity: item.quantity,
//   vendor: product.vendor,
// });
//     }
//   }

//   /* CART */
//   else {
//     const cart = await Cart.findOne({ user: userId });
//     if (!cart || !cart.items.length)
//       throw new Error("Cart is empty");

//     if (!items || !items.length)
//       items = cart.items.map((i) => i._id);

//     for (const cartItemId of items) {
//       const cartItem = cart.items.id(cartItemId);
//       if (!cartItem) throw new Error("Cart item not found");

//       const product = await Product.findById(cartItem.product);
//       if (!product) throw new Error("Product not found");

//       if (product.stock < cartItem.quantity)
//         throw new Error(`${product.name} out of stock`);

//      orderItems.push({
//   price:
//     product.discount > 0
//       ? Math.round(product.price * (1 - product.discount / 100))
//       : product.price,

//   quantity: cartItem.quantity,
//   vendor: product.vendor,
// });
//     }
//   }

//   /* ITEMS TOTAL */
//   const itemsTotal = orderItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   /* DELIVERY */
//   const settings = await PlatformSettings.findOne();
//   if (!settings)
//     throw new Error("Platform settings not configured");

//   let deliveryTotal = 0;

//   if (settings.deliveryMode === "ADMIN") {
//     if (itemsTotal >= settings.freeDeliveryThreshold) {
//       deliveryTotal = 0;
//     } else {
//       deliveryTotal = settings.adminDeliveryCharge;
//     }
//   }

//   /* FINAL */
//   const finalAmount = itemsTotal + deliveryTotal;

//   return {
//     itemsTotal,
//     deliveryTotal,
//     finalAmount,
//   };
// };


// export const createPaymentService = async ({
//   userId,
//   addressId,
//   from,
//   items,
// }) => {
//   const user = await User.findById(userId);
//   if (!user) throw new Error("User not found");

//   const address = user.addresses.id(addressId);
//   if (!address) throw new Error("Invalid address");

//   let orderItems = [];

//   /* BUY NOW */
//   if (from === "buyNow") {
//     if (!items || !items.length)
//       throw new Error("Buy now items missing");

//     for (const item of items) {
//       const product = await Product.findById(item.product);

//       if (!product) throw new Error("Product not found");
//       if (product.stock < item.quantity)
//         throw new Error(`${product.name} out of stock`);

//       orderItems.push({
//         price:
//   product.discount > 0
//     ? Math.round(product.price * (1 - product.discount / 100))
//     : product.price,
//         quantity: item.quantity,
//         vendor: product.vendor,

//         selectedSize: item.selectedSize || item.size,
//   selectedColor: item.selectedColor || item.color,
//       });
//     }
//   }

//   /* CART */
//   else {
//     const cart = await Cart.findOne({ user: userId });
//     if (!cart || !cart.items.length)
//       throw new Error("Cart empty");

//     if (!items || !items.length)
//       items = cart.items.map((i) => i._id);

//     for (const cartItemId of items) {
//       const cartItem = cart.items.id(cartItemId);
//       if (!cartItem) continue;

//       const product = await Product.findById(cartItem.product);

//       if (!product) throw new Error("Product not found");
//       if (product.stock < cartItem.quantity)
//         throw new Error(`${product.name} out of stock`);

//       orderItems.push({
//        price:
//   product.discount > 0
//     ? Math.round(product.price * (1 - product.discount / 100))
//     : product.price,
//         quantity: cartItem.quantity,
//         vendor: product.vendor,

//         selectedSize: cartItem.selectedSize,
//   selectedColor: cartItem.selectedColor,
//       });
//     }
//   }

//   const itemsTotal = orderItems.reduce(
//     (sum, i) => sum + i.price * i.quantity,
//     0
//   );

//   const settings = await PlatformSettings.findOne();
//   if (!settings) throw new Error("Settings missing");

//   let deliveryTotal =
//     itemsTotal >= settings.freeDeliveryThreshold
//       ? 0
//       : settings.adminDeliveryCharge;

//   const finalAmount = itemsTotal + deliveryTotal;

//   console.log("FINAL ₹:", finalAmount);
//   console.log("FINAL paise:", finalAmount * 100);

//   /* ✅ ONLY RAZORPAY ORDER */
//   const razorpayOrder = await createRazorpayOrder({
//     amount: finalAmount * 100,
//     receipt: `rcpt_${Date.now()}`,
//   });

//   return {
//     orderId: razorpayOrder.id,
//     amount: razorpayOrder.amount,
//     currency: razorpayOrder.currency,
//   };
// };



// export const verifyPaymentService = async ({
//   userId,
//   razorpayOrderId,
//   razorpayPaymentId,
//   razorpaySignature,
//   items,
//   from,
//   paymentMethod,
//   clientOrderId,
// }) => {
//   try {
//     /* ================= DEBUG ================= */
//     console.log("🚀 FROM VALUE:", from);
//     console.log("🚀 ITEMS RECEIVED:", items);

//     /* ================= NORMALIZE PAYMENT METHOD ================= */
//     const method = (paymentMethod || "ONLINE").toUpperCase();

//     if (!userId) throw new Error("User ID missing");

//     /* ================= VERIFY (ONLY ONLINE) ================= */
//     if (method === "ONLINE") {
//       const isValid = verifyRazorpaySignature({
//         razorpayOrderId,
//         razorpayPaymentId,
//         razorpaySignature,
//       });

//       if (!isValid) throw new Error("Payment verification failed");
//     }

//     /* ================= DUPLICATE PROTECTION ================= */
//     if (method === "ONLINE") {
//       const existingOrders = await Order.find({ razorpayOrderId });

//       if (existingOrders.length) {
//         console.log("⚠️ Orders already exist, skipping...");
//         return existingOrders;
//       }
//     }

//     /* ================= GET ITEMS ================= */
//     let sourceItems = [];

//     if (from === "cart") {
//       const cart = await Cart.findOne({ user: userId });

//       if (!cart || !cart.items.length)
//         throw new Error("Cart empty");

//       // ✅ fallback only if items missing
//       if (!items || !items.length) {
//         items = cart.items.map((i) => i._id);
//       }

//       console.log("REQ ITEMS:", items);
//       console.log("CART ITEMS:", cart.items);

//       sourceItems = items
//   .map((item) => {
//     // ✅ CASE 1: item is already full object (from frontend)
//    if (typeof item === "object" && item.product) {

//   // ✅ If it already has size/color → use it
//   if (item.selectedSize || item.selectedColor) {
//     return item;
//   }

//   // ❌ If missing → fetch from cart using _id
//   if (item._id) {
//     const cartItem = cart.items.id(item._id);
//     if (cartItem) return cartItem;
//   }
// }

//     // ✅ CASE 2: item is ID → fetch from cart
//     const cartItem = cart.items.id(item);

//     if (!cartItem) {
//       console.log("❌ Cart item missing:", item);
//       return null;
//     }

//     return cartItem;
//   })
//   .filter(Boolean);
//     } 
//     else if (from === "buyNow") {
//       if (!items || !items.length)
//         throw new Error("No items for Buy Now");

//       sourceItems = items;
//     }

//     console.log("SOURCE ITEMS:", sourceItems);

//     /* ================= BUILD ITEMS ================= */
//     let orderItems = [];

//     for (const item of sourceItems) {
//       let productId = null;

//       if (typeof item.product === "object" && item.product !== null) {
//         productId = item.product._id;
//       } else {
//         productId = item.product;
//       }

//       if (!productId) {
//         console.log("❌ INVALID PRODUCT ID:", item);
//         continue;
//       }

//       const product = await Product.findById(productId);

//       if (!product) {
//         console.log("❌ PRODUCT NOT FOUND:", productId);
//         continue;
//       }

//       if (product.stock < item.quantity) {
//         console.log("❌ OUT OF STOCK:", product.name);
//         continue;
//       }

//       orderItems.push({
//         product: product._id,
//         vendor: product.vendor,
//         price:
//   product.discount > 0
//     ? Math.round(product.price * (1 - product.discount / 100))
//     : product.price,
//         quantity: item.quantity,
//           selectedSize: item.selectedSize || item.size || null,
//   selectedColor: item.selectedColor || item.color || null,

//   cartItemId: item._id || null,
//         status: "PLACED",
//         refundStatus: "NONE",
//       });
//     }

//     console.log("ORDER ITEMS:", orderItems);

//     if (!orderItems.length)
//       throw new Error("No valid items to order");

//     /* ================= GROUP BY VENDOR ================= */
//     const vendorGroups = {};

//     for (const item of orderItems) {
//       const vid = item.vendor.toString();
//       if (!vendorGroups[vid]) vendorGroups[vid] = [];
//       vendorGroups[vid].push(item);
//     }

//     const vendorIds = Object.keys(vendorGroups);

//     /* ================= TOTAL ================= */
//     const itemsTotal = orderItems.reduce(
//       (sum, i) => sum + i.price * i.quantity,
//       0
//     );

//     const settings = await PlatformSettings.findOne();
//     if (!settings)
//       throw new Error("Platform settings not configured");

//     const deliveryTotal =
//       itemsTotal >= settings.freeDeliveryThreshold
//         ? 0
//         : settings.adminDeliveryCharge;

//     /* ================= ORDER GROUP ================= */
//     const orderGroup = await OrderGroup.create({
//       user: userId,
//       razorpayOrderId: method === "ONLINE" ? razorpayOrderId : null,
//       totalAmount: itemsTotal + deliveryTotal,
//       deliveryCharge: deliveryTotal,
//       paymentStatus: method === "COD" ? "PENDING" : "PAID",
//     });

//     /* ================= CREATE ORDERS ================= */
//     const createdOrders = [];

//     for (const vendorId of vendorIds) {
//       const vendorItems = vendorGroups[vendorId];

//       const itemsTotalVendor = vendorItems.reduce(
//         (sum, i) => sum + i.price * i.quantity,
//         0
//       );

//       const order = await Order.create({
//         user: userId,
//         vendor: vendorId,
//         orderGroup: orderGroup._id,
//         items: vendorItems,
//         itemsTotal: itemsTotalVendor,
//         deliveryCharge: 0,
//         totalAmount: itemsTotalVendor,
//         razorpayOrderId: method === "ONLINE" ? razorpayOrderId : null,
//          paymentMethod: method, 
//         paymentStatus: method === "COD" ? "PENDING" : "PAID",
//         orderStatus: "PLACED",
//         from: from,
//       });

//       createdOrders.push(order);
//     }

//     console.log("CREATED ORDERS:", createdOrders.length);

//     /* ================= LINK ORDERS ================= */
//     orderGroup.orders = createdOrders.map((o) => o._id);
//     await orderGroup.save();

//     /* ================= STOCK UPDATE ================= */
//     for (const order of createdOrders) {
//       for (const item of order.items) {
//         const product = await Product.findById(item.product);
//         if (product) {
//           product.stock -= item.quantity;
//           await product.save();
//         }
//       }
//     }

//     /* ================= SAVE PAYMENT ================= */
//     if (method === "ONLINE") {
//       await Payment.create({
//         user: userId,
//         orders: createdOrders.map((o) => o._id),
//         razorpayOrderId,
//         razorpayPaymentId,
//         razorpaySignature,
//         amount: itemsTotal + deliveryTotal,
//         status: "SUCCESS",
//       });

//         // 🔥 ADD THIS BLOCK HERE
//   const admin = await Admin.findOne({ role: "ADMIN" });

//   const totalAmount = itemsTotal + deliveryTotal;

//   await Transaction.create({
//     actorType: "ADMIN",
//     actorId: admin._id,
//     type: "CREDIT",
//     amount: totalAmount,
//     source: "ORDER",
//     referenceId: orderGroup._id,
//   });

//   await Admin.findByIdAndUpdate(admin._id, {
//     $inc: { "wallet.balance": totalAmount },
//   });


      
//     } else {
//       await Payment.create({
//         user: userId,
//         orders: createdOrders.map((o) => o._id),
//         amount: itemsTotal + deliveryTotal,
//         method: "COD",
//         status: "PENDING",
//       });
//     }

//     /* ================= CLEAR CART (SAFE FIX) ================= */
//     const isBuyNowFlow =
//       items &&
//       items.length &&
//       typeof items[0] === "object" &&
//       items[0].product; // buyNow items have product field

//     if (from === "cart" && !isBuyNowFlow) {
//       const cart = await Cart.findOne({ user: userId });

//       if (cart) {
//         const itemIds = items
//           .map((i) => {
//             if (typeof i === "object" && i !== null) {
//               return i._id?.toString();
//             }
//             return i.toString();
//           })
//           .filter((id) => id && id.length === 24);

//         console.log("🧾 Removing item IDs:", itemIds);

//         if (itemIds.length) {
//           cart.items = cart.items.filter(
//             (item) => !itemIds.includes(item._id.toString())
//           );

//           cart.totalPrice = cart.items.reduce(
//             (sum, item) => sum + item.price * item.quantity,
//             0
//           );

//           await cart.save();
//         } else {
//           console.log("⚠️ Skipping cart clear (no valid IDs)");
//         }
//       }
//     } else {
//       console.log("🛑 Skipping cart clear (Buy Now flow)");
//     }

//     /* ================= RESPONSE ================= */
//     return {
//       orders: createdOrders,
//       total: itemsTotal + deliveryTotal,
//       deliveryCharge: deliveryTotal,
//     };

//   } catch (err) {
//     console.error("❌ ORDER ERROR:", err.message);
//     throw new Error(err.message || "Order failed");
//   }
// };





import Cart from "../../models/Cart.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import Payment from "../../models/Payment.js";
import Product from "../../models/Product.js";
import Vendor from "../../models/Vendor.js";
import OrderGroup from "../../models/OrderGroup.js";
import PlatformSettings from "../../models/PlatformSettings.js";
import mongoose from "mongoose";
import Transaction from "../../models/Transaction.js";
import Admin from "../../models/Admin.js";



import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "./payment.gateway.js";



export const getCheckoutSummaryService = async ({
  userId,
  addressId,
  from,
  items,
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const address = user.addresses.id(addressId);
  console.log("USER ADDRESSES:", user.addresses);
console.log("REQUESTED ADDRESS ID:", addressId);
  if (!address) throw new Error("Invalid address");

  let orderItems = [];

  /* BUY NOW */
  if (from === "buyNow") {
    if (!items || !items.length)
      throw new Error("Buy now items missing");

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) throw new Error("Product not found");

      if (product.stock < item.quantity)
        throw new Error(`${product.name} out of stock`);

      orderItems.push({
  price:
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price,

  quantity: item.quantity,
  vendor: product.vendor,
});
    }
  }

  /* CART */
  else {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length)
      throw new Error("Cart is empty");

    if (!items || !items.length)
      items = cart.items.map((i) => i._id);

    for (const cartItemId of items) {
      const cartItem = cart.items.id(cartItemId);
      if (!cartItem) throw new Error("Cart item not found");

      const product = await Product.findById(cartItem.product);
      if (!product) throw new Error("Product not found");

      if (product.stock < cartItem.quantity)
        throw new Error(`${product.name} out of stock`);

     orderItems.push({
  price:
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price,

  quantity: cartItem.quantity,
  vendor: product.vendor,
});
    }
  }

  /* ITEMS TOTAL */
  const itemsTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* DELIVERY */
  const settings = await PlatformSettings.findOne();
  if (!settings)
    throw new Error("Platform settings not configured");

  let deliveryTotal = 0;

  if (settings.deliveryMode === "ADMIN") {
    if (itemsTotal >= settings.freeDeliveryThreshold) {
      deliveryTotal = 0;
    } else {
      deliveryTotal = settings.adminDeliveryCharge;
    }
  }

  /* FINAL */
  const finalAmount = itemsTotal + deliveryTotal;

  return {
    itemsTotal,
    deliveryTotal,
    finalAmount,
  };
};


export const createPaymentService = async ({
  userId,
  addressId,
  from,
  items,
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const address = user.addresses.id(addressId);
  if (!address) throw new Error("Invalid address");

  let orderItems = [];

  /* BUY NOW */
  if (from === "buyNow") {
    if (!items || !items.length)
      throw new Error("Buy now items missing");

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) throw new Error("Product not found");
      if (product.stock < item.quantity)
        throw new Error(`${product.name} out of stock`);

      orderItems.push({
        price:
  product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price,
        quantity: item.quantity,
        vendor: product.vendor,

        selectedSize: item.selectedSize || item.size,
  selectedColor: item.selectedColor || item.color,
      });
    }
  }

  /* CART */
  else {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length)
      throw new Error("Cart empty");

    if (!items || !items.length)
      items = cart.items.map((i) => i._id);

    for (const cartItemId of items) {
      const cartItem = cart.items.id(cartItemId);
      if (!cartItem) continue;

      const product = await Product.findById(cartItem.product);

      if (!product) throw new Error("Product not found");
      if (product.stock < cartItem.quantity)
        throw new Error(`${product.name} out of stock`);

      orderItems.push({
       price:
  product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price,
        quantity: cartItem.quantity,
        vendor: product.vendor,

        selectedSize: cartItem.selectedSize,
  selectedColor: cartItem.selectedColor,
      });
    }
  }

  const itemsTotal = orderItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const settings = await PlatformSettings.findOne();
  if (!settings) throw new Error("Settings missing");

  let deliveryTotal =
    itemsTotal >= settings.freeDeliveryThreshold
      ? 0
      : settings.adminDeliveryCharge;

  const finalAmount = itemsTotal + deliveryTotal;

  console.log("FINAL ₹:", finalAmount);
  console.log("FINAL paise:", finalAmount * 100);

  /* ✅ ONLY RAZORPAY ORDER */
  const razorpayOrder = await createRazorpayOrder({
    amount: finalAmount * 100,
    receipt: `rcpt_${Date.now()}`,
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
};



// export const verifyPaymentService = async ({
//   userId,
//   razorpayOrderId,
//   razorpayPaymentId,
//   razorpaySignature,
//   items,
//   from,
//   paymentMethod,
//   clientOrderId,
// }) => {
//   try {    /* ================= NORMALIZE PAYMENT METHOD ================= */
//     const method = (paymentMethod || "ONLINE").toUpperCase();

//     if (!userId) throw new Error("User ID missing");

//     /* ================= VERIFY (ONLY ONLINE) ================= */
//     if (method === "ONLINE") {
//       const isValid = verifyRazorpaySignature({
//         razorpayOrderId,
//         razorpayPaymentId,
//         razorpaySignature,
//       });

//       if (!isValid) throw new Error("Payment verification failed");
//     }

//     /* ================= DUPLICATE PROTECTION ================= */
//     if (method === "ONLINE") {
//       const existingOrders = await Order.find({ razorpayOrderId });

//       if (existingOrders.length) {
//         console.log("⚠️ Orders already exist, skipping...");
//         return existingOrders;
//       }
//     }

//     /* ================= GET ITEMS ================= */
//     let sourceItems = [];

//     if (from === "cart") {
//       const cart = await Cart.findOne({ user: userId });

//       if (!cart || !cart.items.length)
//         throw new Error("Cart empty");

//       // ✅ fallback only if items missing
//       if (!items || !items.length) {
//         items = cart.items.map((i) => i._id);
//       }

//       console.log("REQ ITEMS:", items);
//       console.log("CART ITEMS:", cart.items);

//       sourceItems = items
//   .map((item) => {
//     // ✅ CASE 1: item is already full object (from frontend)
//    if (typeof item === "object" && item.product) {

//   // ✅ If it already has size/color → use it
//   if (item.selectedSize || item.selectedColor) {
//     return item;
//   }

//   // ❌ If missing → fetch from cart using _id
//   if (item._id) {
//     const cartItem = cart.items.id(item._id);
//     if (cartItem) return cartItem;
//   }
// }

//     // ✅ CASE 2: item is ID → fetch from cart
//     const cartItem = cart.items.id(item);

//     if (!cartItem) {
//       console.log("❌ Cart item missing:", item);
//       return null;
//     }

//     return cartItem;
//   })
//   .filter(Boolean);
//     } 
//     else if (from === "buyNow") {
//       if (!items || !items.length)
//         throw new Error("No items for Buy Now");

//       sourceItems = items;
//     }

//     console.log("SOURCE ITEMS:", sourceItems);

//     /* ================= BUILD ITEMS ================= */
//     let orderItems = [];

//     for (const item of sourceItems) {
//       let productId = null;

//       if (typeof item.product === "object" && item.product !== null) {
//         productId = item.product._id;
//       } else {
//         productId = item.product;
//       }

//       if (!productId) {
//         console.log("❌ INVALID PRODUCT ID:", item);
//         continue;
//       }

//       const product = await Product.findById(productId);

//       if (!product) {
//         console.log("❌ PRODUCT NOT FOUND:", productId);
//         continue;
//       }

     

//       orderItems.push({
//         product: product._id,
//         vendor: product.vendor,
//         price:
//   product.discount > 0
//     ? Math.round(product.price * (1 - product.discount / 100))
//     : product.price,
//         quantity: item.quantity,
//           selectedSize: item.selectedSize || item.size || null,
//   selectedColor: item.selectedColor || item.color || null,

//   cartItemId: item._id || null,
//         status: "PLACED",
//         refundStatus: "NONE",
//       });
//     }

//     console.log("ORDER ITEMS:", orderItems);

//     if (!orderItems.length)
//       throw new Error("No valid items to order");

//     /* ================= GROUP BY VENDOR ================= */
//     const vendorGroups = {};

//     for (const item of orderItems) {
//       const vid = item.vendor.toString();
//       if (!vendorGroups[vid]) vendorGroups[vid] = [];
//       vendorGroups[vid].push(item);
//     }

//     const vendorIds = Object.keys(vendorGroups);

//     /* ================= TOTAL ================= */
//     const itemsTotal = orderItems.reduce(
//       (sum, i) => sum + i.price * i.quantity,
//       0
//     );

//     const settings = await PlatformSettings.findOne();
//     if (!settings)
//       throw new Error("Platform settings not configured");

//     const deliveryTotal =
//       itemsTotal >= settings.freeDeliveryThreshold
//         ? 0
//         : settings.adminDeliveryCharge;


        


//     /* ================= ORDER GROUP ================= */
//     const orderGroup = await OrderGroup.create({
//       user: userId,
//       razorpayOrderId: method === "ONLINE" ? razorpayOrderId : null,
//       totalAmount: itemsTotal + deliveryTotal,
//       deliveryCharge: deliveryTotal,
//       paymentStatus: method === "COD" ? "PENDING" : "PAID",
//     });

//     /* ================= CREATE ORDERS ================= */
//     const createdOrders = [];

//     for (const vendorId of vendorIds) {
//       const vendorItems = vendorGroups[vendorId];

//       const itemsTotalVendor = vendorItems.reduce(
//         (sum, i) => sum + i.price * i.quantity,
//         0
//       );

     

//       const order = await Order.create({
//         user: userId,
//         vendor: vendorId,
//         orderGroup: orderGroup._id,
//         items: vendorItems,
//         itemsTotal: itemsTotalVendor,
//         deliveryCharge: 0,
//         totalAmount: itemsTotalVendor,
//         razorpayOrderId: method === "ONLINE" ? razorpayOrderId : null,
//          paymentMethod: method, 
//         paymentStatus: method === "COD" ? "PENDING" : "PAID",
//         orderStatus: "PLACED",
//         from: from,
//       });

//       createdOrders.push(order);
//     }

//      /* ================= STOCK UPDATE ================= */
// for (const order of createdOrders) {
//   for (const item of order.items) {

//     const updatedProduct = await Product.findOneAndUpdate(
//       {
//         _id: item.product,
//         stock: { $gte: item.quantity }, // enough stock check
//       },
//       {
//         $inc: { stock: -item.quantity }, // reduce stock
//       },
//       {
//         new: true,
//       }
//     );

//     // ❌ If stock not available
//    if (!updatedProduct) {
//   const failedProduct = await Product.findById(item.product);

//   throw new Error(
//     `${failedProduct?.name || "Product"} is out of stock`
//   );
// }
//   }
// }

//     /* ================= LINK ORDERS ================= */
//     orderGroup.orders = createdOrders.map((o) => o._id);
//     await orderGroup.save();

   
//     /* ================= SAVE PAYMENT ================= */
//     if (method === "ONLINE") {
//       await Payment.create({
//         user: userId,
//         orders: createdOrders.map((o) => o._id),
//         razorpayOrderId,
//         razorpayPaymentId,
//         razorpaySignature,
//         amount: itemsTotal + deliveryTotal,
//         status: "SUCCESS",
//       });

//         // 🔥 ADD THIS BLOCK HERE
//   const admin = await Admin.findOne({ role: "ADMIN" });

//   const totalAmount = itemsTotal + deliveryTotal;

//   await Transaction.create({
//     actorType: "ADMIN",
//     actorId: admin._id,
//     type: "CREDIT",
//     amount: totalAmount,
//     source: "ORDER",
//     referenceId: orderGroup._id,
//   });

//   await Admin.findByIdAndUpdate(admin._id, {
//     $inc: { "wallet.balance": totalAmount },
//   });


      
//     } else {
//       await Payment.create({
//         user: userId,
//         orders: createdOrders.map((o) => o._id),
//         amount: itemsTotal + deliveryTotal,
//         method: "COD",
//         status: "PENDING",
//       });
//     }

//     /* ================= CLEAR CART (SAFE FIX) ================= */
//     const isBuyNowFlow =
//       items &&
//       items.length &&
//       typeof items[0] === "object" &&
//       items[0].product; // buyNow items have product field

//     if (from === "cart" && !isBuyNowFlow) {
//       const cart = await Cart.findOne({ user: userId });

//       if (cart) {
//         const itemIds = items
//           .map((i) => {
//             if (typeof i === "object" && i !== null) {
//               return i._id?.toString();
//             }
//             return i.toString();
//           })
//           .filter((id) => id && id.length === 24);

//         console.log("🧾 Removing item IDs:", itemIds);

//         if (itemIds.length) {
//           cart.items = cart.items.filter(
//             (item) => !itemIds.includes(item._id.toString())
//           );

//           cart.totalPrice = cart.items.reduce(
//             (sum, item) => sum + item.price * item.quantity,
//             0
//           );

//           await cart.save();
//         } else {
//           console.log("⚠️ Skipping cart clear (no valid IDs)");
//         }
//       }
//     } else {
//       console.log("🛑 Skipping cart clear (Buy Now flow)");
//     }

//     /* ================= RESPONSE ================= */
//     return {
//       orders: createdOrders,
//       total: itemsTotal + deliveryTotal,
//       deliveryCharge: deliveryTotal,
//     };

//   } catch (err) {
//     console.error("❌ ORDER ERROR:", err.message);
//     throw new Error(err.message || "Order failed");
//   }
// };



export const verifyPaymentService = async ({
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  items,
  from,
  paymentMethod,
  clientOrderId,
}) => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    /* ================= DEBUG ================= */
    console.log("🚀 FROM VALUE:", from);
    console.log("🚀 ITEMS RECEIVED:", items);

    /* ================= NORMALIZE PAYMENT METHOD ================= */
    const method = (paymentMethod || "ONLINE").toUpperCase();

    if (!userId) throw new Error("User ID missing");

    /* ================= VERIFY (ONLY ONLINE) ================= */
    if (method === "ONLINE") {
      const isValid = verifyRazorpaySignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      if (!isValid) throw new Error("Payment verification failed");
    }

    /* ================= DUPLICATE PROTECTION ================= */
    if (method === "ONLINE") {
      const existingOrders = await Order.find({
        razorpayOrderId,
      });

      if (existingOrders.length) {
        console.log("⚠️ Orders already exist, skipping...");

        await session.abortTransaction();
        session.endSession();

        return existingOrders;
      }
    }

    /* ================= GET ITEMS ================= */
    let sourceItems = [];

    if (from === "cart") {

      const cart = await Cart.findOne({
        user: userId,
      }).session(session);

      if (!cart || !cart.items.length)
        throw new Error("Cart empty");

      if (!items || !items.length) {
        items = cart.items.map((i) => i._id);
      }

      console.log("REQ ITEMS:", items);
      console.log("CART ITEMS:", cart.items);

      sourceItems = items
        .map((item) => {

          if (
            typeof item === "object" &&
            item.product
          ) {

            if (
              item.selectedSize ||
              item.selectedColor
            ) {
              return item;
            }

            if (item._id) {
              const cartItem = cart.items.id(item._id);

              if (cartItem) return cartItem;
            }
          }

          const cartItem = cart.items.id(item);

          if (!cartItem) {
            console.log("❌ Cart item missing:", item);
            return null;
          }

          return cartItem;
        })
        .filter(Boolean);

    } else if (from === "buyNow") {

      if (!items || !items.length)
        throw new Error("No items for Buy Now");

      sourceItems = items;
    }

    console.log("SOURCE ITEMS:", sourceItems);

    /* ================= BUILD ITEMS ================= */
    let orderItems = [];

    for (const item of sourceItems) {

      let productId = null;

      if (
        typeof item.product === "object" &&
        item.product !== null
      ) {
        productId = item.product._id;
      } else {
        productId = item.product;
      }

      if (!productId) {
        console.log("❌ INVALID PRODUCT ID:", item);
        continue;
      }

      const product = await Product.findById(productId)
        .session(session);

      if (!product) {
        console.log("❌ PRODUCT NOT FOUND:", productId);
        continue;
      }

      orderItems.push({
        product: product._id,
        vendor: product.vendor,

        price:
          product.discount > 0
            ? Math.round(
                product.price *
                  (1 - product.discount / 100)
              )
            : product.price,

        quantity: item.quantity,

        selectedSize:
          item.selectedSize ||
          item.size ||
          null,

        selectedColor:
          item.selectedColor ||
          item.color ||
          null,

        cartItemId: item._id || null,

        status: "PLACED",
        refundStatus: "NONE",
      });
    }

    console.log("ORDER ITEMS:", orderItems);

    if (!orderItems.length)
      throw new Error("No valid items to order");

    /* ================= GROUP BY VENDOR ================= */
    const vendorGroups = {};

    for (const item of orderItems) {
      const vid = item.vendor.toString();

      if (!vendorGroups[vid])
        vendorGroups[vid] = [];

      vendorGroups[vid].push(item);
    }

    const vendorIds = Object.keys(vendorGroups);

    /* ================= TOTAL ================= */
    const itemsTotal = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const settings = await PlatformSettings.findOne()
      .session(session);

    if (!settings)
      throw new Error(
        "Platform settings not configured"
      );

    const deliveryTotal =
      itemsTotal >= settings.freeDeliveryThreshold
        ? 0
        : settings.adminDeliveryCharge;

    /* ================= STOCK UPDATE FIRST ================= */

    for (const item of orderItems) {

      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedProduct) {

        const failedProduct =
          await Product.findById(item.product)
            .session(session);

        throw new Error(
          `${
            failedProduct?.name || "Product"
          } is out of stock`
        );
      }
    }

    /* ================= ORDER GROUP ================= */

    const orderGroupArr =
      await OrderGroup.create(
        [
          {
            user: userId,

            razorpayOrderId:
              method === "ONLINE"
                ? razorpayOrderId
                : null,

            totalAmount:
              itemsTotal + deliveryTotal,

            deliveryCharge:
              deliveryTotal,

            paymentStatus:
              method === "COD"
                ? "PENDING"
                : "PAID",
          },
        ],
        { session }
      );

    const orderGroup = orderGroupArr[0];

    /* ================= CREATE ORDERS ================= */

    const createdOrders = [];

    for (const vendorId of vendorIds) {

      const vendorItems =
        vendorGroups[vendorId];

      const itemsTotalVendor =
        vendorItems.reduce(
          (sum, i) =>
            sum + i.price * i.quantity,
          0
        );

      const orderArr = await Order.create(
        [
          {
            user: userId,

            vendor: vendorId,

            orderGroup:
              orderGroup._id,

            items: vendorItems,

            itemsTotal:
              itemsTotalVendor,

            deliveryCharge: 0,

            totalAmount:
              itemsTotalVendor,

            razorpayOrderId:
              method === "ONLINE"
                ? razorpayOrderId
                : null,

            paymentMethod: method,

            paymentStatus:
              method === "COD"
                ? "PENDING"
                : "PAID",

            orderStatus: "PLACED",

            from: from,
          },
        ],
        { session }
      );

      createdOrders.push(orderArr[0]);
    }

    /* ================= LINK ORDERS ================= */

    orderGroup.orders =
      createdOrders.map((o) => o._id);

    await orderGroup.save({ session });

    /* ================= SAVE PAYMENT ================= */

    if (method === "ONLINE") {

      await Payment.create(
        [
          {
            user: userId,

            orders:
              createdOrders.map(
                (o) => o._id
              ),

            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,

            amount:
              itemsTotal + deliveryTotal,

            status: "SUCCESS",
          },
        ],
        { session }
      );

      const admin =
        await Admin.findOne({
          role: "ADMIN",
        }).session(session);

      const totalAmount =
        itemsTotal + deliveryTotal;

      await Transaction.create(
        [
          {
            actorType: "ADMIN",

            actorId: admin._id,

            type: "CREDIT",

            amount: totalAmount,

            source: "ORDER",

            referenceId:
              orderGroup._id,
          },
        ],
        { session }
      );

      await Admin.findByIdAndUpdate(
        admin._id,
        {
          $inc: {
            "wallet.balance":
              totalAmount,
          },
        },
        { session }
      );

    } else {

      await Payment.create(
        [
          {
            user: userId,

            orders:
              createdOrders.map(
                (o) => o._id
              ),

            amount:
              itemsTotal + deliveryTotal,

            method: "COD",

            status: "PENDING",
          },
        ],
        { session }
      );
    }

    /* ================= CLEAR CART ================= */

    const isBuyNowFlow =
      items &&
      items.length &&
      typeof items[0] === "object" &&
      items[0].product;

    if (
      from === "cart" &&
      !isBuyNowFlow
    ) {

      const cart = await Cart.findOne({
        user: userId,
      }).session(session);

      if (cart) {

        const itemIds = items
          .map((i) => {

            if (
              typeof i === "object" &&
              i !== null
            ) {
              return i._id?.toString();
            }

            return i.toString();
          })
          .filter(
            (id) =>
              id &&
              id.length === 24
          );

        console.log(
          "🧾 Removing item IDs:",
          itemIds
        );

        if (itemIds.length) {

          cart.items =
            cart.items.filter(
              (item) =>
                !itemIds.includes(
                  item._id.toString()
                )
            );

          cart.totalPrice =
            cart.items.reduce(
              (sum, item) =>
                sum +
                item.price *
                  item.quantity,
              0
            );

          await cart.save({ session });

        } else {
          console.log(
            "⚠️ Skipping cart clear (no valid IDs)"
          );
        }
      }

    } else {
      console.log(
        "🛑 Skipping cart clear (Buy Now flow)"
      );
    }

    /* ================= COMMIT ================= */

    await session.commitTransaction();

    session.endSession();

    /* ================= RESPONSE ================= */

    return {
      orders: createdOrders,
      total:
        itemsTotal + deliveryTotal,

      deliveryCharge:
        deliveryTotal,
    };

  } catch (err) {

    await session.abortTransaction();

    session.endSession();

    console.error(
      "❌ ORDER ERROR:",
      err.message
    );

    throw new Error(
      err.message || "Order failed"
    );
  }
};