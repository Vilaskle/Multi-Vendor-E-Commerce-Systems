import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes.js";
import vendorRoutes from "./modules/vendor/vendor.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const app = express();
// Middleware to read JSON body


app.use(cors({
  origin:"http://localhost:5173",
  method:["GET","POST","PUT","DELETE"],
  Credentials:true
}));

app.use(express.json());

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
