// import mongoose from "mongoose";

// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   vendor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Vendor",
//     required: true,
//   },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true }, // snapshot
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     items: [orderItemSchema],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     address: {
//       fullName: String,
//       phoneNo: String,
//       email: String,
//       addressLine: String,
//       city: String,
//       state: String,
//       pincode: String,
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["PENDING", "PAID", "FAILED"],
//       default: "PENDING",
//     },

//     orderStatus: {
//   type: String,
//   enum: [
//     "PLACED",
//     "PROCESSING",
//     "SHIPPED",
//     "OUT_FOR_DELIVERY",
//     "DELIVERED",
//     "CANCELLED",
//   ],
//   default: "PLACED",
// },

//     trackingHistory: [
//   {
//     Status: {
//       type: String,
//       enum: [
//         "PLACED",
//         "PROCESSING",
//         "SHIPPED",
//         "OUT_FOR_DELIVERY",
//         "DELIVERED",
//         "CANCELLED",
//       ],
//     },
//     message: String,
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//   },
// ],

//     razorpayOrderId: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);




import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },

  quantity: Number,
  price: Number,

  selectedSize: String,
  selectedColor: String,

  cartItemId: mongoose.Schema.Types.ObjectId,
  // ✅ ADD THIS
  createdAt: {
    type: Date,
    default: Date.now
  },

  // ✅ NEW FIELDS
  status: {
    type: String,
    enum: [
      "PLACED",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURN_REQUESTED",
        "RETURN_APPROVED",  
        "RETURN_REJECTED", 
      "RETURN_COMPLETED",
      "REFUNDED",
      "EXCHANGE_REQUESTED",
"EXCHANGE_SHIPPED",
    ],
    default: "PLACED"
  },

  cancelReason: String,
  returnReason: String,

  refundStatus: {
    type: String,
    enum: ["NONE", "PENDING", "COMPLETED"],
    default: "NONE"
  },

  refundId: String,
refundAmount: Number,

exchangeStatus: {
  type: String,
  enum: ["NONE", "REQUESTED", "APPROVED", "COMPLETED"],
  default: "NONE"
},

exchangeRequest: {
  newSize: String,
  newColor: String,
  reason: String,
  requestedAt: Date,
},
  exchangeApprovedAt: Date,
  exchangeCompletedAt: Date,

deliveredAt: Date, 
  exchangedItemId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  // 👇 If this is a new exchanged item
  isExchangeItem: {
    type: Boolean,
    default: false,
  },

  // 👇 Reference to original item
  originalItemId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  
  refundDetails: {
  method: {
    type: String,
    enum: ["UPI", "BANK"],
  },

  upiId: String,

  bankAccountNumber: String,
  bankIFSC: String,
  bankName: String,
  accountHolderName: String,
},

reviewed: {
  type: Boolean,
  default: false
},
isSettled: {
  type: Boolean,
  default: false
}

});

orderItemSchema.index({ originalItemId: 1 });
orderItemSchema.index({ exchangeStatus: 1 });


const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },

  orderGroup: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "OrderGroup"
},

  items: [orderItemSchema],
  itemsTotal: {
  type: Number,
  required: true,
},

deliveryCharge: {
  type: Number,
  default: 0,
},

  totalAmount: {
    type: Number,
    required: true
  },

  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  paymentMethod: {
    type: String,
    enum: ["ONLINE", "COD"],
    default: "ONLINE"
  },

  orderStatus: {
    type: String,
    enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PLACED"
  },

  razorpayOrderId: String,

  from: {
    type: String,
    enum: ["buyNow", "cart"]
  },
  
  

}, { timestamps: true });


export default mongoose.model("Order", orderSchema);