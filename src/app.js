import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes.js";
import vendorRoutes from "./modules/vendor/vendor.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const app = express();
// Middleware to read JSON body

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://unprunable-underbred-shyla.ngrok-free.dev",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.get("/api/test",(req,res)=>{
  res.json({message:"Backend connected successfully"})
})

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
