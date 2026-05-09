// import mongoose from "mongoose";

// const adminSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       lowercase:true,
//       unique: true,
      
//     },

//     password: {
//       type: String,
//       required: true,
//       select:false,
//     },

//     role: {
//       type: String,
//       default: "ADMIN",
//     },
//     isActive: {
//       type:Boolean,
//       default:true,
//     },

//     lastLogin:Date,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Admin", adminSchema);



import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase:true,
      unique: true,
      
    },

    password: {
      type: String,
      required: true,
      select:false,
    },

    role: {
      type: String,
      default: "ADMIN",
    },
    isActive: {
      type:Boolean,
      default:true,
    },

    lastLogin:Date,

    wallet: {
  balance: {
    type: Number,
    default: 0,
  },
},
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);