// import express from "express";
// import cors from "cors";

// import authRoutes from "./auth/auth.routes.js";
// import userRoutes from "./modules/user/user.routes.js";
// import vendorRoutes from "./modules/vendor/vendor.routes.js";
// import adminRoutes from "./modules/admin/admin.routes.js";

// import dotenv from "dotenv";
// dotenv.config();

// const app = express();

// // // ✅ CORS FIRST
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173",
// //     credentials: true,
// //   })
// // );

// // // ✅ Body parser
// // app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://miracle-undefinitive-luridly.ngrok-free.dev"
//     ],
//     credentials: true
//   })
// );
//  app.use(express.json());
// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/vendors", vendorRoutes);
// app.use("/api/admin", adminRoutes);
// // Health check
// app.get("/", (req, res) => {
//   res.send("Backend API is running");
// });

// export default app;




import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import vendorRoutes from "./modules/vendor/vendor.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vendor panel (PC A)
      "http://localhost:5174", // Admin panel (PC A)
      "https://semiyearly-theocratically-karen.ngrok-free.dev", //sidh
      "https://unprunable-underbred-shyla.ngrok-free.dev", //shar
    ],
    credentials: true,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

export default app;