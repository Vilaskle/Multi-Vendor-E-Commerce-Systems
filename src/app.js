import express from "express";
import userRoutes from "./modules/user/user.routes.js";
import vendorRoutes from "./modules/vendor/vendor.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const app = express();
// Middleware to read JSON body
app.use(express.json());

// Routes
// app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", vendorRoutes);
app.use("/api", adminRoutes);


// Health check route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

export default app;
