import dotenv from "dotenv";


dotenv.config();


import { startUnverifiedUserCleanup } from "./scripts/cleanupUnverifiedUsers.js";


import connectDB from "./config/db.js";
import app from "./app.js";

connectDB();
startUnverifiedUserCleanup();




const PORT = process.env.PORT || 5000;
console.log("Before listen...");
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
